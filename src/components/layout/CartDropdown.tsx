import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppStore";
import {
  decreaseQuantity,
  deleteItem,
  increaseQuantity,
} from "@/store/slices/productSlice";
import { Minus, Plus, ShoppingBag, Trash } from "lucide-react";
import Image from "next/image";

const CartDropdown = () => {
  const { cartItems } = useAppSelector((state) => state.product);
  const dispatch = useAppDispatch();
  const subtotal = cartItems?.reduce((total, item) => {
    return total + Number(item.price) * item.quantity;
  }, 0);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="rounded-full cursor-pointer w-7 h-7 p-1.5 relative">
          <ShoppingBag className="text-white" />
          <span className="absolute -top-1 -right-1 w-4 h-4 flex justify-center items-center bg-red-500 text-white text-xs rounded-full">
            {cartItems?.length > 9 ? "9+" : cartItems?.length}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-h-[calc(100vh-8rem)] overflow-auto scrollbar-thin">
        <PopoverHeader>
          <PopoverTitle>Cart Itmes</PopoverTitle>
        </PopoverHeader>

        {cartItems?.map((item) => (
          <div key={item.cart_item_id} className="flex gap-4">
            <div className="w-25 h-31.25">
              <Image src={item.image_url} alt="image" width={60} height={75} />
              <p className="font-semibold">${item.line_total}</p>
            </div>
            <div>
              <p>{item.product_name}</p>
              <div>
                {item.color_name && (
                  <p className="text-gray-600 text-sm">
                    Color: {item.color_name}
                  </p>
                )}
                {item.size_name && (
                  <p className="text-gray-600 text-sm">
                    Size: {item.size_name}
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center px-3 py-1 border-2 border-amber-500 rounded-full w-28 mt-2">
                {item.quantity > 1 ? (
                  <button
                    onClick={() =>
                      dispatch(decreaseQuantity(item.cart_item_id))
                    }
                  >
                    <Minus size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => dispatch(deleteItem(item.cart_item_id))}
                  >
                    <Trash size={16} />
                  </button>
                )}
                <p>{item.quantity}</p>
                <button
                  onClick={() => dispatch(increaseQuantity(item.cart_item_id))}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="border-b"></div>
        <div className="my-2 text-center font-semibold">
          Subtotal: ${subtotal.toFixed(2)}
        </div>
        <div className="border-b"></div>
        <Button className="flex-1 py-1">Proceed to Buy</Button>
      </PopoverContent>
    </Popover>
  );
};

export default CartDropdown;
