'use client'
import ProductItem from "@/components/productItem/ProductItem";
import { Spinner } from "@/components/ui/spinner";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppStore";
import { IProduct } from "@/store/slices/productSlice";
import { loadData } from "@/utility/httpRequest";
import { endpoints } from "@/variables/variables";
import { useEffect, useState } from "react";
import Pagination from "@/components/pagination/Pagination";
import { Slider } from "@/components/ui/slider"
import FilterProduct from "../../components/filterProduct/FilterProduct";
import { ListFilterPlus, X } from "lucide-react";


export default function Products() {
  const { sizes, catagories, colors, collections, tags, genders, brands, availabilities } = useAppSelector((state) => state.catalog);
  const [products, setProducts] = useState<IProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(12)
  const [totalPage, setTotalPage] = useState(1)
  const [value, setValue] = useState([100, 100])
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  // const dispatch = useAppDispatch();

  const accordionItems = [
    {
      value: "availabilities",
      trigger: "Availabilities",
      content: (
        <div className="flex flex-col gap-2">
          {availabilities.map((ava) => (
            <label key={ava.availability_id} className="flex items-center gap-2 cursor-pointer py-1">
              <input type="checkbox" value={ava.availability_id} className="rounded" />
              <span>{ava.availability_name}</span>
            </label>
          ))}
        </div>
      ),
    },
    {
      value: "categories",
      trigger: "Categories",
      content: (
        <div className="flex flex-col gap-2">
          {catagories.map((cat) => (
            <label key={cat.catagory_id} className="flex items-center gap-2 cursor-pointer py-1">
              <input type="checkbox" value={cat.catagory_id} className="rounded" />
              <span>{cat.catagory_name}</span>
            </label>
          ))}
        </div>
      ),
    },
    {
      value: "colors",
      trigger: "Colors",
      content: (
        <div className="flex flex-col gap-2">
          {colors.map((color) => (
            <label key={color.color_id} className="flex items-center gap-2 cursor-pointer py-1">
              <input type="checkbox" value={color.color_id} className="rounded" />
              <span>{color.color_name}</span>
            </label>
          ))}
        </div>
      ),
    },
    {
      value: "collections",
      trigger: "Collections",
      content: (
        <div className="flex flex-col gap-2">
          {collections.map((coll) => (
            <label key={coll.collection_id} className="flex items-center gap-2 cursor-pointer py-1">
              <input type="checkbox" value={coll.collection_id} className="rounded" />
              <span>{coll.collection_name}</span>
            </label>
          ))}
        </div>
      ),
    },
    {
      value: "tags",
      trigger: "Tags",
      content: (
        <div className="flex flex-col gap-2">
          {tags.map((tag) => (
            <label key={tag.tag_id} className="flex items-center gap-2 cursor-pointer py-1">
              <input type="checkbox" value={tag.tag_id} className="rounded" />
              <span>{tag.tag_name}</span>
            </label>
          ))}
        </div>
      ),
    },
    {
      value: "genders",
      trigger: "Genders",
      content: (
        <div className="flex flex-col gap-2">
          {genders.map((gen) => (
            <label key={gen.gender_id} className="flex items-center gap-2 cursor-pointer py-1">
              <input type="checkbox" value={gen.gender_id} className="rounded" />
              <span>{gen.gender_name}</span>
            </label>
          ))}
        </div>
      ),
    },
    {
      value: "brands",
      trigger: "Brands",
      content: (
        <div className="flex flex-col gap-2 h-50 overflow-x-auto custom">
          {/* {brands.map((brand) => (
            <button
              key={brand.brand_id}
              className="border rounded p-2 text-sm text-center hover:bg-muted"
            >
              <input type="checkbox" value={brand.brand_id} className="rounded" />
              {brand.brand_name}
            </button>
          ))} */}
          {brands.map((brand) => (
            <label key={brand.brand_id} className="flex items-center gap-2 cursor-pointer py-1">
              <input type="checkbox" value={brand.brand_id} className="rounded" />
              <span>{brand.brand_name}</span>
            </label>
          ))}
        </div>
      ),
    },
  ];

  // Products
  useEffect(() => {
    (async () => {
      const params = {
        url: `${endpoints.Products}?page=${page}&limit=${limit}`,
        // url: `${endpoints.Products}?product_id=${}&page=${}&limit=${}&product_name=${}`,
        // payload: { user: data.user, password: data.password },
        // isConsole: true,
        // isToast: true,
        setLoading: setIsLoading,
      };

      const res = await loadData(params);
      if (res?.data) {
        setProducts(res.data.result);
        setTotalPage(res.data.totalPages);
      } else {
        setTotalPage(1);
      }

    })();
  }, [page, limit, totalPage]);
  console.log(value)
  return <>
    <div className="grid grid-cols-4 gap-6">

      {/* filters */}
      <div className="col-span-1 hidden md:block">
        <span className="font-bold">Filters</span>
        {/* Size  */}
        {/* <div className="flex flex-col my-2">
                <span>Size</span>
                <div className="flex gap-3">
                  {["XS", "S", "M", "L", "2XL"].map((size, i) => (
                    <span key={i} className="border h-10 w-10 flex justify-center items-center">{size}</span>
                  ))}
                </div>
            </div>
        <div className="border-b  border-gray-300" /> */}

        {/* Price Range */}
        <div className="flex flex-col my-4 gap-4">
          <span>Price Range</span>
          <span className="text-sm text-center text-muted-foreground border p-2">
            {value.join(" - ")}
          </span>
          <div className="flex flex-col gap-3">
            <Slider
              id="slider-demo-temperature"
              value={value}
              onValueChange={(value) => setValue(value as number[])}
              min={100}
              max={100000}
              step={10}
            />
          </div>
        </div>
        <div className="border-b  border-gray-300" />
        <FilterProduct items={accordionItems} />
      </div>

      {/* all products */}
      <div className="col-span-4 md:col-span-3">
        <button className="md:hidden" onClick={() => setMobileFilterOpen(true)}>
          <ListFilterPlus />
        </button>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4  gap-6">
          {isLoading ?
            <div className="col-span-2 md:col-span-3 xl:col-span-4 grid place-items-center h-[80vh] w-full">
              <Spinner className="w-10 h-10" />
            </div>
            :
            <>
              {products.map((product, i) => (
                <ProductItem key={i} item={product} />
              ))}
            </>
          }
        </div>
        <div className="justify-center md:justify-self-end mt-6">
          <Pagination currentPage={page} setCurrentPage={setPage} totalPages={totalPage} />
        </div>
      </div>

      {/* Mobile filter bottom sheet */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${mobileFilterOpen ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
      >
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${mobileFilterOpen ? 'opacity-100' : 'opacity-0'
            }`}
          onClick={() => setMobileFilterOpen(false)}
        />
        <div
          className={`absolute bottom-0 left-0 right-0 bg-background rounded-t-2xl max-h-[90vh] overflow-y-auto shadow-lg transition-transform duration-300 ${mobileFilterOpen ? 'translate-y-0' : 'translate-y-full'
            }`}
        >
          <div className="sticky top-0 bg-white z-50 border-b px-4 py-3 flex items-center justify-between rounded-t-2xl">
            <span className="font-bold">Filters</span>
            <button onClick={() => setMobileFilterOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 overflow-y-auto">
            <div className="flex flex-col my-4 gap-4">
              <span>Price Range</span>
              <span className="text-sm text-center text-muted-foreground border p-2">
                {value.join(" - ")}
              </span>
              <div className="flex flex-col gap-3">
                <Slider
                  id="slider-demo-temperature"
                  value={value}
                  onValueChange={(value) => setValue(value as number[])}
                  min={100}
                  max={100000}
                  step={10}
                />
              </div>
            </div>
            <div className="border-b border-gray-300" />
            <FilterProduct items={accordionItems} />
          </div>
        </div>
      </div>
    </div>
  </>;
}
