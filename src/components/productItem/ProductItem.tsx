import { useAppSelector } from "@/hooks/useAppStore";
import { IProduct } from "@/store/slices/productSlice";
import { categoryName } from "@/utility/general";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
interface CarouselProps {
  item: IProduct;
  products?: boolean;
}
function ProductItem({ item, products = true }: CarouselProps) {
  const { catagories } = useAppSelector((state) => state.catalog);
  const router = useRouter();
  return (
    <div
      className="cursor-pointer relative"
      onClick={() => {
        router.push(`/products/${item.product_id}`);
      }}
    >
      <div className="flex items-center justify-center border relative">
        {/* SVG fallback needs unoptimized — next/image can't optimize SVGs */}
        <Image
          src={item.image_urls?.[0] ?? "/no-image.svg"}
          alt="Product Image"
          height={522}
          width={418}
          unoptimized={!item.image_urls?.[0]}
          className="hover:scale-105 transition-all duration-300"
        />
        {/* {!products && (
          <span className="absolute bottom-0 bg-gray-300 p-2 flex justify-center items-center">
            <Plus />
          </span>
        )} */}
      </div>
      <div>
        <span className="bg-gray-700 text-white px-2 py-0.5 rounded-sm text-[10px] absolute top-2 right-2">
          {categoryName(item.catagory_id, catagories)}
        </span>
        <h5 className="line-clamp-2 mt-2">{item?.product_name}</h5>
        <span className="text-sm text-gray-600">
          ${item.min_price} - ${item.max_price}
        </span>
      </div>
    </div>
  );
}
export default ProductItem;
