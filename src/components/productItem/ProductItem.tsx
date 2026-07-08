import { IProduct } from "@/store/slices/productSlice";
import { Plus } from "lucide-react"
interface CarouselProps {
    item: IProduct;
    products?: boolean;
}
function ProductItem({ item, products = true }: CarouselProps) {
    return (
        <div className="cursor-pointer">
            <div className="bg-gray-50 h-48 md:h-78.5 flex items-center justify-center border relative">
                <span>{item.product_name}</span>
                {!products && (<span className="absolute bottom-0 bg-gray-300 p-2 flex justify-center items-center">
                    <Plus />
                </span>)}
            </div>
            <div className="pt-4">
                <p className="text-gray-600">V-Neck T-Shlrt</p>
                <div className="flex justify-between font-medium">
                    <h5>{item.product_name}</h5>
                    <span>$4</span>
                </div>
            </div>
        </div>
    )
}
export default ProductItem