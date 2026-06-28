"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { ISize } from "@/store/slices/productSlice";
import { loadData, postData, putData } from "@/utility/httpRequest";
import { endpoints } from "@/variables/variables";
import CustomModal from "@/components/modal/CustomModal";
import { convertToTitleCase } from "@/utility/general";
import { Spinner } from "@/components/ui/spinner";
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

interface Props {
  action: string;
  setAction: React.Dispatch<React.SetStateAction<string>>;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItems: ISize[];
  setState: React.Dispatch<React.SetStateAction<number>>;
  catalogType: string;
}

const Modal = ({
  action,
  setAction,
  openModal,
  setOpenModal,
  selectedItems,
  setState,
  catalogType,
}: Props) => {
  const { catagories } = useAppSelector((state) => state.product);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const SizeSchema = z.object({
    catagory_id: z.string().min(1, "Category is required"),
    size_name: z.string().min(1, "Size name is required"),
  });

  type sizeForm = z.infer<typeof SizeSchema>;

  const form = useForm<sizeForm>({
    resolver: zodResolver(SizeSchema),
    defaultValues: {
      catagory_id:
        action === "edit" ? selectedItems[0].catagory_id.toString() : "",
      size_name: action === "edit" ? selectedItems[0].size_name : "",
    },
  });

  useEffect(() => {
    if (!openModal) return; // 🔥 KEY FIX

    if (action === "edit" && selectedItems[0]) {
      const fetchSize = async () => {
        const res = await loadData({
          url: `${endpoints.Sizes}?size_id=${selectedItems[0].size_id}`,
          setLoading: setIsLoading,
          //   accessToken: token.access_token,
        });

        form.reset({
          catagory_id: String(res?.data.result.catagory_id),
          size_name: res?.data.result.size_name,
        });
      };

      fetchSize();
    }

    if (action === "add") {
      form.reset({
        catagory_id: "",
        size_name: "",
      });
    }
  }, [action, selectedItems, openModal, form]);

  const handleClose = () => {
    setOpenModal(false);
    setAction("");
  };

  const onSubmit = async (data: sizeForm) => {
    const payload = {
      ...data,
      catagory_id: Number(data.catagory_id),
    };
    if (action === "add") {
      const params = {
        url: `${endpoints.Sizes}`,
        setLoading: setIsSubmitting,
        payload,
        isToast: true,
        // accessToken: token.access_token,
      };
      const res = await postData(params);

      if (res?.status === 201) {
        setState((prev) => prev + 1);
        form.reset();
        handleClose();
      }
    } else {
      const params = {
        url: `${endpoints.Sizes}?size_id=${selectedItems[0].size_id}`,
        setLoading: setIsSubmitting,
        payload,
        isToast: true,
        // accessToken: token.access_token,
      };

      const res = await putData(params);
      if (res?.status === 200) {
        setState((prev) => prev + 1);
        form.reset();
        handleClose();
      }
    }
  };

  return (
    <>
      {action && openModal && catalogType === "size" && (
        <CustomModal className="md:w-120 w-80  overflow-hidden">
          <div className="flex justify-between bg-[#CEDEF2] p-4">
            <h3 className="font-semibold capitalize">
              {convertToTitleCase(action)} {convertToTitleCase(catalogType)}
            </h3>
            <X onClick={handleClose} className="cursor-pointer" />
          </div>

          <div className="max-h-[70vh] p-4 overflow-auto scrollbar-thin">
            {isLoading ? (
              <div className="w-full flex justify-center">
                <Spinner />
              </div>
            ) : (
              <div>
                <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                  <FieldGroup>
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
                              {catagories.map((category) => (
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
                    {/* Size Name */}
                    <Controller
                      name="size_name"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="form-rhf-demo-title">
                            Size Name
                          </FieldLabel>
                          <Input
                            {...field}
                            id="form-rhf-demo-title"
                            aria-invalid={fieldState.invalid}
                            placeholder="S, 39 ..."
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

                <Field
                  orientation="horizontal"
                  className="flex justify-end mt-4"
                >
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
          </div>
        </CustomModal>
      )}
    </>
  );
};

export default Modal;
