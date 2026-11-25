"use client";
import ProductItem from "@/components/productItem/ProductItem";
import { Spinner } from "@/components/ui/spinner";
import { useAppSelector } from "@/hooks/useAppStore";
import { IProduct } from "@/store/slices/productSlice";
import { loadData } from "@/utility/httpRequest";
import { endpoints } from "@/variables/variables";
import { useEffect, useState } from "react";
import Pagination from "@/components/pagination/Pagination";
import { Slider } from "@/components/ui/slider";
import FilterProduct from "../../components/filterProduct/FilterProduct";
import { ListFilterPlus, X } from "lucide-react";
import SearchInput from "@/components/searchInput/SearchInput";

type FacetKey =
  | "availabilities"
  | "categories"
  | "colors"
  | "collections"
  | "tags"
  | "genders"
  | "brands";

type FacetCounts = Record<FacetKey, { id: number; count: number }[]>;

const facetKeys: FacetKey[] = [
  "availabilities",
  "categories",
  "colors",
  "collections",
  "tags",
  "genders",
  "brands",
];

const createEmptySelection = (): Record<FacetKey, number[]> => ({
  availabilities: [],
  categories: [],
  colors: [],
  collections: [],
  tags: [],
  genders: [],
  brands: [],
});

const createEmptyCounts = (): FacetCounts => ({
  availabilities: [],
  categories: [],
  colors: [],
  collections: [],
  tags: [],
  genders: [],
  brands: [],
});

export default function Products() {
  const {
    catagories,
    colors,
    collections,
    tags,
    genders,
    brands,
    availabilities,
  } = useAppSelector((state) => state.catalog);

  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [total, setTotal] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record<FacetKey, number[]>>(
    createEmptySelection,
  );
  const [facetCounts, setFacetCounts] = useState<FacetCounts>(createEmptyCounts);
  const [facetsLoaded, setFacetsLoaded] = useState(false);
  const [priceBounds, setPriceBounds] = useState({ min: 100, max: 100000 });
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const toggleFacet = (key: FacetKey, id: number) => {
    setSelected((current) => ({
      ...current,
      [key]: current[key].includes(id)
        ? current[key].filter((value) => value !== id)
        : [...current[key], id],
    }));
    setPage(1);
  };

  const clearFilters = () => {
    setSelected(createEmptySelection());
    setPriceRange(null);
    setQuery("");
    setPage(1);
  };

  const activeFilterCount =
    facetKeys.reduce((count, key) => count + selected[key].length, 0) +
    (priceRange ? 1 : 0) +
    (query.trim() ? 1 : 0);

  const facetConfigs: {
    key: FacetKey;
    trigger: string;
    items: { id: number; label: string }[];
    containerClassName?: string;
  }[] = [
    {
      key: "availabilities",
      trigger: "Availabilities",
      items: availabilities.map((ava) => ({
        id: ava.availability_id,
        label: ava.availability_name,
      })),
    },
    {
      key: "categories",
      trigger: "Categories",
      items: catagories.map((cat) => ({
        id: cat.catagory_id,
        label: cat.catagory_name,
      })),
    },
    {
      key: "colors",
      trigger: "Colors",
      items: colors.map((color) => ({
        id: color.color_id,
        label: color.color_name,
      })),
    },
    {
      key: "collections",
      trigger: "Collections",
      items: collections.map((coll) => ({
        id: coll.collection_id,
        label: coll.collection_name,
      })),
    },
    {
      key: "tags",
      trigger: "Tags",
      items: tags.map((tag) => ({ id: tag.tag_id, label: tag.tag_name })),
    },
    {
      key: "genders",
      trigger: "Genders",
      items: genders.map((gen) => ({
        id: gen.gender_id,
        label: gen.gender_name,
      })),
    },
    {
      key: "brands",
      trigger: "Brands",
      items: brands.map((brand) => ({
        id: brand.brand_id,
        label: brand.brand_name,
      })),
      containerClassName: "h-50 overflow-x-auto custom",
    },
  ];

  const accordionItems = facetConfigs.map((config) => ({
    value: config.key,
    trigger: config.trigger,
    content: (
      <div
        className={`flex flex-col gap-2 ${config.containerClassName ?? ""}`}
      >
        {config.items.map((item) => {
          const checked = selected[config.key].includes(item.id);
          const count =
            facetCounts[config.key].find((entry) => entry.id === item.id)
              ?.count ?? 0;

          return (
            <label
              key={item.id}
              className="flex w-full items-center gap-2 cursor-pointer py-1"
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={facetsLoaded && !checked && count === 0}
                onChange={() => toggleFacet(config.key, item.id)}
                className="rounded"
              />
              <span>{item.label}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {count}
              </span>
            </label>
          );
        })}
      </div>
    ),
  }));

  useEffect(() => {
    let active = true;

    const timer = setTimeout(async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (query.trim()) params.set("q", query.trim());
      facetKeys.forEach((key) => {
        if (selected[key].length > 0) {
          params.set(key, selected[key].join(","));
        }
      });
      if (priceRange) {
        params.set("min_price", String(priceRange[0]));
        params.set("max_price", String(priceRange[1]));
      }

      setIsLoading(true);
      try {
        const res = await loadData({
          url: `${endpoints.ProductsFaceted}?${params.toString()}`,
        });
        if (!active || !res?.data) {
          if (active) {
            setProducts([]);
            setTotal(0);
            setTotalPage(1);
          }
          return;
        }

        setProducts(res.data.result ?? []);
        setTotal(res.data.total ?? 0);
        setTotalPage(res.data.totalPages ?? 1);
        setFacetCounts(res.data.facets ?? createEmptyCounts());
        setFacetsLoaded(true);
        if (res.data.priceRange) {
          setPriceBounds(res.data.priceRange);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }, query.trim() ? 300 : 0);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [page, limit, query, selected, priceRange]);

  const displayedPrice = priceRange ?? [priceBounds.min, priceBounds.max];

  const priceRangeControl = (
    <div className="flex flex-col my-4 gap-4">
      <span>Price Range</span>
      <span className="text-sm text-center text-muted-foreground border p-2">
        {displayedPrice.join(" - ")}
      </span>
      <div className="flex flex-col gap-3">
        <Slider
          id="product-price-range"
          value={displayedPrice}
          onValueChange={(value) => {
            setPriceRange(value as [number, number]);
            setPage(1);
          }}
          min={priceBounds.min}
          max={priceBounds.max}
          step={10}
        />
      </div>
    </div>
  );

  const filterHeader = (
    <div className="flex items-center justify-between">
      <span className="font-bold">Filters</span>
      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="text-sm text-muted-foreground hover:underline"
        >
          Clear all ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-4 gap-6">
        {/* filters */}
        <div className="col-span-1 hidden md:block">
          {filterHeader}
          {priceRangeControl}
          <div className="border-b border-gray-300" />
          <FilterProduct items={accordionItems} />
        </div>

        {/* all products */}
        <div className="col-span-4 md:col-span-3">
          <div className="mb-4 flex items-center gap-3">
            <button
              className="md:hidden"
              onClick={() => setMobileFilterOpen(true)}
            >
              <ListFilterPlus />
            </button>
            <SearchInput
              placeholder="Search products"
              query={query}
              setQuery={(value) => {
                setQuery(value);
                setPage(1);
              }}
            />
            <span className="hidden sm:inline text-sm text-muted-foreground whitespace-nowrap">
              {total} products
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              <div className="col-span-2 md:col-span-3 xl:col-span-4 grid place-items-center h-[80vh] w-full">
                <Spinner className="w-10 h-10" />
              </div>
            ) : (
              <>
                {products.map((product, i) => (
                  <ProductItem key={product.product_id ?? i} item={product} />
                ))}
              </>
            )}
          </div>
          <div className="justify-center md:justify-self-end mt-6">
            <Pagination
              currentPage={page}
              setCurrentPage={setPage}
              totalPages={totalPage}
            />
          </div>
        </div>

        {/* Mobile filter bottom sheet */}
        <div
          className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
            mobileFilterOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <div
            className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
              mobileFilterOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setMobileFilterOpen(false)}
          />
          <div
            className={`absolute bottom-0 left-0 right-0 bg-background rounded-t-2xl max-h-[90vh] overflow-y-auto shadow-lg transition-transform duration-300 ${
              mobileFilterOpen ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <div className="sticky top-0 bg-white z-50 border-b px-4 py-3 flex items-center justify-between rounded-t-2xl">
              {filterHeader}
              <button onClick={() => setMobileFilterOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              {priceRangeControl}
              <div className="border-b border-gray-300" />
              <FilterProduct items={accordionItems} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
