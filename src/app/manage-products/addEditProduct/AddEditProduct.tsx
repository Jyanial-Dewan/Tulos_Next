"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useAppSelector } from "@/hooks/useAppStore";
import { Spinner } from "@/components/ui/spinner";
import { useSearchParams } from "next/navigation";
import { loadData, postData, putData } from "@/utility/httpRequest";
import { endpoints } from "@/variables/variables";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  setProductId: React.Dispatch<React.SetStateAction<number | null>>;
}

const SizeSchema = z.object({
  product_name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  catagory_id: z.string().min(1, "Category is required"),
  brand_id: z.string().min(1, "Brand is required"),
  collection_id: z.string().min(1, "Collection is required"),
  gender_id: z.string().min(1, "Gender is required"),
  availability_id: z.string().min(1, "Availability is required"),
  tag_ids: z.array(z.number()).optional(),
});

const AddEditProduct = ({ setProductId }: Props) => {
  const searchParams = useSearchParams();
  const product_id = Number(searchParams.get("product_id"));
  const { catagories, collections, brands, tags, genders, availabilities } =
    useAppSelector((state) => state.catalog);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  type sizeForm = z.infer<typeof SizeSchema>;

  const form = useForm<sizeForm>({
    resolver: zodResolver(SizeSchema),
    defaultValues: {
      product_name: "",
      description: "",
      catagory_id: "",
      brand_id: "",
      collection_id: "",
      gender_id: "",
      availability_id: "",
      tag_ids: [],
    },
  });

  useEffect(() => {
    if (product_id) {
      const fetchProduct = async () => {
        const res = await loadData({
          url: `${endpoints.Products}?product_id=${product_id}`,
          setLoading: setIsLoading,
          //   accessToken: token.access_token,
        });

        form.reset({
          product_name: res?.data.result.product_name,
          description: res?.data.result.description,
          catagory_id: String(res?.data.result.catagory_id),
          brand_id: String(res?.data.result.brand_id),
          collection_id: String(res?.data.result.collection_id),
          gender_id: String(res?.data.result.gender_id),
          availability_id: String(res?.data.result.availability_id),
        });
      };

      fetchProduct();
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
      });
    }
  }, [form, product_id]);

  const onSubmit = async (data: sizeForm) => {
    const payload = {
      ...data,
      catagory_id: Number(data.catagory_id),
      brand_id: Number(data.brand_id),
      collection_id: Number(data.collection_id),
      gender_id: Number(data.gender_id),
      availability_id: Number(data.availability_id),
    };

    if (!product_id) {
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
        setProductId(res.data.result.product_id);
        form.reset();
        // const tagRes = await postData({
        //   url: `${endpoints.ProductTags}`,
        //   setLoading: setIsSubmitting,
        //   payload: {
        //     product_id: Number(res.data.result.product_id),
        //     tag_ids: data.tag_ids,
        //   },
        //   isToast: true,
        // });
        // console.log(tagRes);
        // if (tagRes?.status === 201) {

        // }
      }
    } else {
      const params = {
        url: `${endpoints.Products}?product_id=${product_id}`,
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
        <CardTitle>Add Product</CardTitle>
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
                          <SelectValue placeholder="Select a category" />
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
                          <SelectValue placeholder="Select a category" />
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
                          <SelectValue placeholder="Select a category" />
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
              </FieldGroup>
            </form>

            <Field orientation="horizontal" className="flex justify-end mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button
                type="submit"
                form="form-rhf-demo"
                disabled={isSubmitting}
              >
                {isSubmitting && <Spinner />}
                Submit
              </Button>
            </Field>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AddEditProduct;
