import { prisma } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { NextResponse } from "next/server";

/**
 * Faceted product search.
 *
 * Query params:
 *   q                                  free text (product name / description)
 *   availabilities,categories,colors,collections,tags,genders,brands
 *                                      comma separated ids (OR within a facet,
 *                                      AND across facets)
 *   min_price,max_price                price window (overlaps variant range)
 *   page,limit                         pagination
 *
 * Response also includes:
 *   facets    -> counts per facet value, calculated without that facet's own
 *                selection (so alternatives stay visible/clickable)
 *   priceRange -> global min/max price, used to drive the UI slider
 */

const scalarFacetFields = {
  availabilities: "availability_id",
  categories: "catagory_id",
  collections: "collection_id",
  genders: "gender_id",
  brands: "brand_id",
} as const;

type ScalarFacetKey = keyof typeof scalarFacetFields;
type RelationFacetKey = "colors" | "tags";
type FacetKey = ScalarFacetKey | RelationFacetKey;

const facetKeys: FacetKey[] = [
  "availabilities",
  "categories",
  "colors",
  "collections",
  "tags",
  "genders",
  "brands",
];

type FacetCount = { id: number; count: number };
type SelectedFacets = Record<FacetKey, number[]>;

function createEmptySelection(): SelectedFacets {
  return {
    availabilities: [],
    categories: [],
    colors: [],
    collections: [],
    tags: [],
    genders: [],
    brands: [],
  };
}

function parseIds(raw: string | null): number[] {
  if (!raw) return [];
  const ids = raw
    .split(",")
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isInteger(value) && value > 0);
  return Array.from(new Set(ids));
}

function parseBound(raw: string | null): number | undefined {
  if (raw === null || raw.trim() === "") return undefined;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : undefined;
}

function buildScalarWhere(
  selected: SelectedFacets,
  query: string,
  minPrice: number | undefined,
  maxPrice: number | undefined,
  skip?: FacetKey,
): Prisma.product_viewWhereInput {
  const where: Prisma.product_viewWhereInput = {};

  if (query) {
    where.OR = [
      { product_name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }

  (Object.keys(scalarFacetFields) as ScalarFacetKey[]).forEach((key) => {
    if (key === skip || selected[key].length === 0) return;
    Object.assign(where, {
      [scalarFacetFields[key]]: { in: selected[key] },
    });
  });

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.AND = [
      { min_price: { lte: maxPrice ?? Number.MAX_SAFE_INTEGER } },
      { max_price: { gte: minPrice ?? 0 } },
    ];
  }

  return where;
}

/**
 * Resolves the product ids that match every active filter.
 * `skip` removes one facet from the calculation, which is what gives us
 * disjunctive facet counts.
 */
async function resolveProductIds(
  selected: SelectedFacets,
  query: string,
  minPrice: number | undefined,
  maxPrice: number | undefined,
  skip?: FacetKey,
): Promise<number[]> {
  const scalarRows = await prisma.product_view.findMany({
    where: buildScalarWhere(selected, query, minPrice, maxPrice, skip),
    select: { product_id: true },
  });

  let ids = scalarRows.map((row) => row.product_id);
  if (ids.length === 0) return ids;

  // Colors and tags live on related tables, not on product_view.
  if (skip !== "colors" && selected.colors.length > 0) {
    const colorRows = await prisma.products.findMany({
      where: {
        product_id: { in: ids },
        product_variants: { some: { color_id: { in: selected.colors } } },
      },
      select: { product_id: true },
    });
    ids = colorRows.map((row) => row.product_id);
    if (ids.length === 0) return ids;
  }

  if (skip !== "tags" && selected.tags.length > 0) {
    const tagRows = await prisma.products.findMany({
      where: {
        product_id: { in: ids },
        product_tags: { some: { tag_id: { in: selected.tags } } },
      },
      select: { product_id: true },
    });
    ids = tagRows.map((row) => row.product_id);
  }

  return ids;
}

async function scalarFacetCounts(
  key: ScalarFacetKey,
  ids: number[],
): Promise<FacetCount[]> {
  if (ids.length === 0) return [];

  const field = scalarFacetFields[key];
  const groups = await prisma.product_view.groupBy({
    by: [field as Prisma.Product_viewScalarFieldEnum],
    where: { product_id: { in: ids } },
    _count: { _all: true },
  });

  return (
    groups as unknown as Array<
      Record<string, number> & { _count: { _all: number } }
    >
  )
    .filter((group) => group[field] !== null && group[field] !== undefined)
    .map((group) => ({ id: group[field], count: group._count._all }));
}

async function colorFacetCounts(ids: number[]): Promise<FacetCount[]> {
  if (ids.length === 0) return [];

  const rows = await prisma.product_variants.findMany({
    where: { product_id: { in: ids }, color_id: { not: null } },
    select: { product_id: true, color_id: true },
  });

  // A product can have several variants in the same color; count it once.
  const productsByColor = new Map<number, Set<number>>();
  for (const row of rows) {
    if (row.color_id === null) continue;
    const products = productsByColor.get(row.color_id) ?? new Set<number>();
    products.add(row.product_id);
    productsByColor.set(row.color_id, products);
  }

  return Array.from(productsByColor, ([id, products]) => ({
    id,
    count: products.size,
  }));
}

async function tagFacetCounts(ids: number[]): Promise<FacetCount[]> {
  if (ids.length === 0) return [];

  // product_id + tag_id is unique, so no extra de-duplication is needed.
  const rows = await prisma.product_tags.findMany({
    where: { product_id: { in: ids } },
    select: { product_id: true, tag_id: true },
  });

  const counts = new Map<number, number>();
  for (const row of rows) {
    counts.set(row.tag_id, (counts.get(row.tag_id) ?? 0) + 1);
  }

  return Array.from(counts, ([id, count]) => ({ id, count }));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const query = (searchParams.get("q") ?? "").trim();
  const selected = createEmptySelection();
  facetKeys.forEach((key) => {
    selected[key] = parseIds(searchParams.get(key));
  });

  const minPrice = parseBound(searchParams.get("min_price"));
  const maxPrice = parseBound(searchParams.get("max_price"));
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number(searchParams.get("limit")) || 12),
  );

  try {
    const matchingIds = await resolveProductIds(
      selected,
      query,
      minPrice,
      maxPrice,
    );
    const total = matchingIds.length;

    const result =
      total === 0
        ? []
        : await prisma.product_view.findMany({
            where: { product_id: { in: matchingIds } },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { created_at: "desc" },
          });

    // Counts are computed in parallel. Each facet ignores its own selection.
    const facetPromises = facetKeys.map(async (key) => {
      const ids = await resolveProductIds(
        selected,
        query,
        minPrice,
        maxPrice,
        key,
      );
      if (key === "colors") return colorFacetCounts(ids);
      if (key === "tags") return tagFacetCounts(ids);
      return scalarFacetCounts(key, ids);
    });

    const [priceAggregate, ...facetLists] = await Promise.all([
      prisma.product_view.aggregate({
        _min: { min_price: true },
        _max: { max_price: true },
      }),
      ...facetPromises,
    ]);

    const facets = {} as Record<FacetKey, FacetCount[]>;
    facetKeys.forEach((key, index) => {
      facets[key] = (facetLists[index] ?? []) as FacetCount[];
    });

    const priceRange = {
      min: Math.floor(Number(priceAggregate._min.min_price ?? 0)),
      max: Math.ceil(Number(priceAggregate._max.max_price ?? 100000)),
    };
    if (priceRange.max <= priceRange.min) {
      priceRange.max = priceRange.min + 1;
    }

    return NextResponse.json({
      result,
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      facets,
      priceRange,
    });
  } catch (error) {
    console.error("Faceted product search failed:", error);
    return NextResponse.json(
      { message: "Faceted product search failed" },
      { status: 500 },
    );
  }
}
