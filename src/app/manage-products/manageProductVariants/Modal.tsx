"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Controller, useForm, useWatch } from "react-hook-form";
import CustomModal from "@/components/modal/CustomModal";
import { convertToTitleCase } from "@/utility/general";
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
import { useAppSelector } from "@/hooks/useAppStore";
import { IProduct, IProductVariant } from "@/store/slices/productSlice";

interface Props {
  action: string;
  setAction: React.Dispatch<React.SetStateAction<string>>;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItems: IProductVariant[];
  setData: React.Dispatch<React.SetStateAction<[] | IProductVariant[]>>;
  product?: IProduct;
}

const ProductVariantSchema = z.object({
  color_id: z.string().optional(),
  size_id: z.string().optional(),
  price: z.number().positive(),
  stock: z.number().min(1),
});

type productVariantForm = z.infer<typeof ProductVariantSchema>;

const getDefaultValues = (
  action: string,
  selectedItems: IProductVariant[],
): productVariantForm => {
  if (action === "edit" && selectedItems[0]) {
    return {
      color_id: selectedItems[0].color_id?.toString(),
      size_id: selectedItems[0].size_id?.toString(),
      price: Number(selectedItems[0].price),
      stock: Number(selectedItems[0].stock),
    };
  }

  return {
    color_id: undefined,
    size_id: undefined,
    price: 0,
    stock: 1,
  };
};

const Modal = ({
  action,
  setAction,
  openModal,
  setOpenModal,
  selectedItems,
  setData,
  product,
}: Props) => {
  const { colors, sizes } = useAppSelector((state) => state.catalog);
  const eligibleSizes = sizes.filter(
    (item) => item.catagory_id === product?.catagory_id,
  );

  const form = useForm<productVariantForm>({
    resolver: zodResolver(ProductVariantSchema),
    defaultValues: getDefaultValues(action, selectedItems),
  });

  const color = useWatch({
    control: form.control,
    name: "color_id",
  });

  const colorId = Number(color);

  const size = useWatch({
    control: form.control,
    name: "size_id",
  });

  const sizeId = Number(size);

  useEffect(() => {
    if (!openModal) return;

    form.reset(getDefaultValues(action, selectedItems));
  }, [action, selectedItems, openModal, form]);

  const handleClose = () => {
    setOpenModal(false);
    setAction("");
  };

  const handleReset = useCallback(() => {
    form.reset(getDefaultValues(action, selectedItems));
  }, [action, selectedItems, form]);

  const onSubmit = async (data: productVariantForm) => {
    if (action === "add") {
      setData((prev) => [
        ...prev,
        {
          variant_id: 0,
          product_id: product?.product_id as number,
          color_id: colorId ? Number(colorId) : undefined,
          size_id: sizeId ? Number(sizeId) : undefined,
          sku: `${product?.product_id}_${colorId ?? "NA"}_${sizeId ?? "NA"}`,
          barcode: undefined,
          price: data.price,
          stock: data.stock,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
    } else {
      setData((prev) =>
        prev.map((variant) =>
          variant.variant_id === selectedItems[0].variant_id
            ? {
                ...variant,
                color_id: colorId ? Number(colorId) : undefined,
                size_id: sizeId ? Number(sizeId) : undefined,
                sku: `${selectedItems[0].product_id}_${colorId ?? "NA"}_${sizeId ?? "NA"}`,
                price: data.price,
                stock: data.stock,
                updated_at: new Date(),
              }
            : variant,
        ),
      );
    }
  };

  return (
    <>
      {openModal && (
        <CustomModal
          key={selectedItems[0]?.variant_id}
          className="md:w-120 w-80  overflow-hidden"
        >
          <div className="flex justify-between bg-[#CEDEF2] p-4">
            <h3 className="font-semibold capitalize">
              {convertToTitleCase(action)} Variant
            </h3>
            <X onClick={handleClose} className="cursor-pointer" />
          </div>

          <div className="max-h-[70vh] p-4 overflow-auto scrollbar-thin">
            <div>
              <form
                id="form-product-variant"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FieldGroup>
                  {/* Colors */}
                  <Controller
                    name="color_id"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Color</FieldLabel>

                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            if (value) field.onChange(value);
                          }}
                        >
                          <SelectTrigger aria-invalid={fieldState.invalid}>
                            <SelectValue placeholder="Select a color" />
                          </SelectTrigger>

                          <SelectContent>
                            {colors.map((color) => (
                              <SelectItem
                                key={color.color_id}
                                value={color.color_id.toString()}
                              >
                                {color.color_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  {/* Size */}
                  <Controller
                    name="size_id"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Size</FieldLabel>

                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            if (value) field.onChange(value);
                          }}
                        >
                          <SelectTrigger aria-invalid={fieldState.invalid}>
                            <SelectValue placeholder="Select a size" />
                          </SelectTrigger>

                          <SelectContent>
                            {eligibleSizes.map((size) => (
                              <SelectItem
                                key={size.size_id.toString()}
                                value={size.size_id.toString()}
                              >
                                {size.size_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  {/* Price */}
                  <Controller
                    name="price"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Price</FieldLabel>
                        <Input
                          {...field}
                          type="number"
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                          aria-invalid={fieldState.invalid}
                          placeholder="11.00"
                          autoComplete="off"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  {/* Stock */}
                  <Controller
                    name="stock"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Stock</FieldLabel>
                        <Input
                          {...field}
                          type="number"
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                          aria-invalid={fieldState.invalid}
                          placeholder="10"
                          autoComplete="off"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </form>

              <Field orientation="horizontal" className="flex justify-end mt-4">
                <Button type="button" variant="outline" onClick={handleReset}>
                  Reset
                </Button>
                <Button type="submit" form="form-product-variant">
                  Okay
                </Button>
              </Field>
            </div>
          </div>
        </CustomModal>
      )}
    </>
  );
};

export default Modal;
