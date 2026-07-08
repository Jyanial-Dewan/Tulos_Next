import { useAppSelector } from "@/hooks/useAppStore";
import { IProduct } from "@/store/slices/productSlice";
import { categoryName } from "@/utility/general";
import { Plus } from "lucide-react"
import Image from "next/image";
interface CarouselProps {
    item: IProduct;
    products?: boolean;
}
function ProductItem({ item, products = true }: CarouselProps) {
    const { catagories } = useAppSelector((state) => state.catalog);
    return (
        <div className="cursor-pointer">
            <div className="flex items-center justify-center border relative">
                {/* SVG fallback needs unoptimized — next/image can't optimize SVGs */}
                <Image src={item.image_urls?.[0] ?? '/no-image.svg'} alt="Product Image" height={522} width={418} unoptimized={!item.image_urls?.[0]} />
                {!products && (
                    <span className="absolute bottom-0 bg-gray-300 p-2 flex justify-center items-center">
                        <Plus />
                    </span>
                )}
            </div>
            <div>
                <span className="text-gray-500 text-[12px]">{categoryName(item.catagory_id, catagories)}</span>
                <h5 className="line-clamp-1 text-sm">{item?.product_name}</h5>
                <span>$4</span>
            </div>
        </div>
    )
}
export default ProductItem