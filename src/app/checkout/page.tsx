"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useAppStore";
import {
  decreaseQuantity,
  deleteItem,
  increaseQuantity,
  setCartItem,
} from "@/store/slices/productSlice";
import { colorName, sizeName } from "@/utility/general";
import { Minus, Plus, Trash } from "lucide-react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { endpoints } from "@/variables/variables";
import { postData } from "@/utility/httpRequest";

const OrderSchema = z.object({
  payment_method: z.string().min(1, "Payment method is required"),
  delivery_address: z.string().min(1, "Delivery Address is required"),
  notes: z.string().optional(),
});

const CheckoutPage = () => {
  const { cartItems } = useAppSelector((state) => state.product);
  const { colors, sizes } = useAppSelector((state) => state.catalog);
  const { token } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cartItems?.reduce((total, item) => {
    return total + Number(item.price) * item.quantity;
  }, 0);

  type orderForm = z.infer<typeof OrderSchema>;

  const form = useForm<orderForm>({
    resolver: zodResolver(OrderSchema),
    defaultValues: {
      payment_method: "",
      delivery_address: "",
      notes: "",
    },
  });

  const onSubmit = async (data: orderForm) => {
    const order_items = cartItems.map((item) => {
      return { variant_id: item.variant_id, quantity: item.quantity };
    });

    const payload = {
      customer_id: token.user_id,
      total_amount: Number(subtotal),
      payment_method: data.payment_method,
      delivery_address: data.delivery_address,
      notes: data.notes,
      order_items,
    };

    console.log(payload);

    const params = {
      url: `${endpoints.Orders}`,
      setLoading: setIsSubmitting,
      payload,
      isToast: true,
      // accessToken: token.access_token,
    };

    const res = await postData(params);

    if (res?.status === 201) {
      form.reset();
      dispatch(setCartItem([]));
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Shipment Details */}
      <div className="border p-4">
        <h1 className="font-semibold text-2xl mb-6">Shipment Details</h1>
        <form id="form-order" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-2">
            <Controller
              name="delivery_address"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Delivery Address</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="DM Complex, Banarupa, Rangamati"
                    autoComplete="off"
                    className="w-full"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="notes"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Notes</FieldLabel>

                  <Textarea
                    {...field}
                    id="description"
                    aria-invalid={fieldState.invalid}
                    placeholder="Happy Birthday"
                    autoComplete="off"
                    rows={2}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="payment_method"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Payment Method</FieldLabel>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="Cash on Delivery">
                        Cash on Delivery
                      </SelectItem>
                      <SelectItem value="Bank">Bank</SelectItem>
                      <SelectItem value="Card">Card</SelectItem>
                    </SelectContent>
                  </Select>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <Button
          type="submit"
          form="form-order"
          disabled={isSubmitting}
          className="w-full mt-4"
        >
          {isSubmitting && <Spinner />}
          Place Order
        </Button>
      </div>

      {/* Order Details */}
      <div className="p-4 bg-gray-100">
        <h1 className="font-semibold text-2xl">Order Details</h1>
        <div className="flex flex-col gap-4 mt-6 pb-4 border-b">
          {cartItems?.map((item) => (
            <div key={item.cart_item_id} className="flex justify-between">
              <div className="w-[60px] h-[75px] overflow-hidden">
                <Image
                  src={item.image_url}
                  alt="image"
                  width={60}
                  height={75}
                />
              </div>
              <div className="w-[60%]">
                <p className="font-semibold">{item.product_name}</p>
                <div className="flex gap-2 mt-1 text-sm">
                  {item.color_id && (
                    <p>Color: {colorName(item.color_id, colors)}</p>
                  )}
                  {item.size_id && <p>Size: {sizeName(item.size_id, sizes)}</p>}
                </div>
              </div>
              <div className="flex justify-between items-center px-3 border-2 border-amber-500 rounded-full w-28 h-10">
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
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <h1 className="font-bold">Total: ${subtotal}</h1>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
