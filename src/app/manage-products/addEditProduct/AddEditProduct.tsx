"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Controller, useForm, useWatch } from "react-hook-form";
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
import { Spinner } from "@/components/ui/spinner";
import { loadData, postData, putData } from "@/utility/httpRequest";
import { endpoints } from "@/variables/variables";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { IProduct, IProductTags } from "@/store/slices/productSlice";
import { convertToTitleCase } from "@/utility/general";

interface Props {
  setProduct?: React.Dispatch<React.SetStateAction<IProduct | undefined>>;
  action: string;
  product?: IProduct | undefined;
}

const ProductSchema = z.object({
  product_name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  catagory_id: z.string().min(1, "Category is required"),
  brand_id: z.string().min(1, "Brand is required"),
  collection_id: z.string().min(1, "Collection is required"),
  gender_id: z.string().min(1, "Gender is required"),
  availability_id: z.string().min(1, "Availability is required"),
  tag_ids: z.array(z.number()).optional(),
  color_ids: z.array(z.number()).optional(),
  size_ids: z.array(z.number()).optional(),
  price: z.number().positive().optional(),
  stock: z.number().min(1).optional(),
});

const AddEditProduct = ({ setProduct, action, product }: Props) => {
  const {
    catagories,
    collections,
    brands,
    tags,
    genders,
    availabilities,
    colors,
    sizes,
  } = useAppSelector((state) => state.catalog);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [productTags, setProductTags] = useState<IProductTags[]>([]);
  type productForm = z.infer<typeof ProductSchema>;

  const form = useForm<productForm>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      product_name: "",
      description: "",
      catagory_id: "",
      brand_id: "",
      collection_id: "",
      gender_id: "",
      availability_id: "",
      tag_ids: [],
      color_ids: [],
      size_ids: [],
      price: 0,
      stock: 1,
    },
  });

  const category = useWatch({
    control: form.control,
    name: "catagory_id",
  });

  const categoryId = Number(category);

  const eligibleSizes = sizes.filter((item) => item.catagory_id === categoryId);

  useEffect(() => {
    if (action === "edit" && product && productTags) {
      form.reset({
        product_name: product.product_name,
        description: product.description,
        catagory_id: String(product.catagory_id),
        brand_id: String(product.brand_id),
        collection_id: String(product.collection_id),
        gender_id: String(product.gender_id),
        availability_id: String(product.availability_id),
        tag_ids: productTags.map((item) => item.tag_id),
      });
    } else {
      form.reset({
        product_name: "",
        description: "",
        catagory_id: "",
        brand_id: "",
        collection_id: "",
        gender_id: "",
        availability_id: "",
        tag_ids: [],
        color_ids: [],
        size_ids: [],
        price: 0,
        stock: 1,
      });
    }
  }, [action, product, form, productTags]);

  useEffect(() => {
    if (product?.product_id) {
      const fetchProductTags = async () => {
        const res = await loadData({
          url: `${endpoints.ProductTags}?product_id=${product.product_id}`,
          setLoading: setIsLoading,
          //   accessToken: token.access_token,
        });
        console.log(res);
        if (res?.status == 200) {
          setProductTags(res.data.result);
        }
      };

      fetchProductTags();
    }
  }, [product?.product_id]);

  const onSubmit = async (data: productForm) => {
    const payload = {
      ...data,
      catagory_id: Number(data.catagory_id),
      brand_id: Number(data.brand_id),
      collection_id: Number(data.collection_id),
      gender_id: Number(data.gender_id),
      availability_id: Number(data.availability_id),
    };

    if (action === "add") {
      const params = {
        url: `${endpoints.Products}`,
        setLoading: setIsSubmitting,
        payload,
        isToast: true,
        // accessToken: token.access_token,
      };
      const res = await postData(params);
      console.log(res);
      if (res?.status === 201) {
        if (setProduct) setProduct(res.data.result);
        form.reset();
      }
    } else {
      const params = {
        url: `${endpoints.Products}?product_id=${product?.product_id}`,
        setLoading: setIsSubmitting,
        payload,
        isToast: true,
        // accessToken: token.access_token,
      };

      const res = await putData(params);
      if (res?.status === 200) {
        form.reset();
      }
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <p>{convertToTitleCase(action)} Product</p>
          <div className="flex gap-3 items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type="submit" form="form-rhf-demo" disabled={isSubmitting}>
              {isSubmitting && <Spinner />}
              Submit
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {isLoading ? (
          <div className="w-full flex justify-center">
            <Spinner />
          </div>
        ) : (
          <div>
            <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup className="space-y-2 lg:grid lg:grid-cols-2 gap-4">
                {/* Size Name */}
                <Controller
                  name="product_name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-demo-title">
                        Product Name
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-rhf-demo-title"
                        aria-invalid={fieldState.invalid}
                        placeholder="Nike Mens Sb Heritage"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                {/* Category */}
                <Controller
                  name="catagory_id"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Category</FieldLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger aria-invalid={fieldState.invalid}>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>

                        <SelectContent>
                          {catagories?.map((category) => (
                            <SelectItem
                              key={category.catagory_id}
                              value={category.catagory_id.toString()}
                            >
                              {category.catagory_name}
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
                {/* Brand */}
                <Controller
                  name="brand_id"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Brand</FieldLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger aria-invalid={fieldState.invalid}>
                          <SelectValue placeholder="Select a brand" />
                        </SelectTrigger>

                        <SelectContent>
                          {brands?.map((brand) => (
                            <SelectItem
                              key={brand.brand_id}
                              value={brand.brand_id.toString()}
                            >
                              {brand.brand_name}
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
                {/* Collection */}
                <Controller
                  name="collection_id"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Collection</FieldLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger aria-invalid={fieldState.invalid}>
                          <SelectValue placeholder="Select a collection" />
                        </SelectTrigger>

                        <SelectContent>
                          {collections?.map((collection) => (
                            <SelectItem
                              key={collection.collection_id}
                              value={collection.collection_id.toString()}
                            >
                              {collection.collection_name}
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
                {/* Gender */}
                <Controller
                  name="gender_id"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Gender</FieldLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger aria-invalid={fieldState.invalid}>
                          <SelectValue placeholder="Select a gender" />
                        </SelectTrigger>

                        <SelectContent>
                          {genders?.map((gender) => (
                            <SelectItem
                              key={gender.gender_id}
                              value={gender.gender_id.toString()}
                            >
                              {gender.gender_name}
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
                {/* Availability */}
                <Controller
                  name="availability_id"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Availability</FieldLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger aria-invalid={fieldState.invalid}>
                          <SelectValue placeholder="Select an availability" />
                        </SelectTrigger>

                        <SelectContent>
                          {availabilities?.map((availability) => (
                            <SelectItem
                              key={availability.availability_id}
                              value={availability.availability_id.toString()}
                            >
                              {availability.availability_name}
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
                {action === "add" && (
                  <Controller
                    name="price"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-rhf-demo-title">
                          Price
                        </FieldLabel>
                        <Input
                          {...field}
                          type="number"
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                          id="form-rhf-demo-title"
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
                )}
                {/* Stock */}
                {action === "add" && (
                  <Controller
                    name="stock"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-rhf-demo-title">
                          Stock
                        </FieldLabel>
                        <Input
                          {...field}
                          type="number"
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                          id="form-rhf-demo-title"
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
                )}

                {/* Tags */}
                <Controller
                  name="tag_ids"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="col-span-2"
                    >
                      <FieldLabel>Tags</FieldLabel>

                      <div className="flex flex-wrap items-center gap-3 rounded-md border p-2">
                        {tags.map((tag) => (
                          <div
                            key={tag.tag_id}
                            className="flex items-center gap-1"
                          >
                            <Checkbox
                              checked={field.value?.includes(tag.tag_id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([
                                    ...(field.value ?? []),
                                    tag.tag_id,
                                  ]);
                                } else {
                                  field.onChange(
                                    field.value?.filter(
                                      (id) => id !== tag.tag_id,
                                    ),
                                  );
                                }
                              }}
                            />

                            <label>{tag.tag_name}</label>
                          </div>
                        ))}
                      </div>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Colors */}
                {action === "add" && (
                  <Controller
                    name="color_ids"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className="col-span-2"
                      >
                        <FieldLabel>Colors</FieldLabel>

                        <div className="flex flex-wrap items-center gap-3 rounded-md border p-2">
                          {colors.map((color) => (
                            <div
                              key={color.color_id}
                              className="flex items-center gap-1"
                            >
                              <Checkbox
                                checked={field.value?.includes(color.color_id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([
                                      ...(field.value ?? []),
                                      color.color_id,
                                    ]);
                                  } else {
                                    field.onChange(
                                      field.value?.filter(
                                        (id) => id !== color.color_id,
                                      ),
                                    );
                                  }
                                }}
                              />

                              <label>{color.color_name}</label>
                            </div>
                          ))}
                        </div>

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                )}

                {/* Sizes */}
                {action === "add" && (
                  <Controller
                    name="size_ids"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className="col-span-2"
                      >
                        <FieldLabel>Sizes</FieldLabel>

                        <div className="flex flex-wrap items-center gap-3 rounded-md border p-2">
                          {eligibleSizes.map((size) => (
                            <div
                              key={size.size_id}
                              className="flex items-center gap-1"
                            >
                              <Checkbox
                                checked={field.value?.includes(size.size_id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([
                                      ...(field.value ?? []),
                                      size.size_id,
                                    ]);
                                  } else {
                                    field.onChange(
                                      field.value?.filter(
                                        (id) => id !== size.size_id,
                                      ),
                                    );
                                  }
                                }}
                              />

                              <label>{size.size_name}</label>
                            </div>
                          ))}
                        </div>

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                )}

                {/* Description */}
                <Controller
                  name="description"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="col-span-2"
                    >
                      <FieldLabel htmlFor="description">Description</FieldLabel>

                      <Textarea
                        {...field}
                        id="description"
                        aria-invalid={fieldState.invalid}
                        placeholder="The Nike SB Heritage Vulc combines..."
                        autoComplete="off"
                        rows={2}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AddEditProduct;
