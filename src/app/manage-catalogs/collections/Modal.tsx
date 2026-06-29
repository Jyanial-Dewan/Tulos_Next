"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { ICollection } from "@/store/slices/catalogSlice";
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

interface Props {
  action: string;
  setAction: React.Dispatch<React.SetStateAction<string>>;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItems: ICollection[];
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
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const CollectionSchema = z.object({
    collection_name: z.string().min(1, "Collection Name is required"),
  });

  type catagoryForm = z.infer<typeof CollectionSchema>;

  const form = useForm<catagoryForm>({
    resolver: zodResolver(CollectionSchema),
    defaultValues: {
      collection_name:
        action === "edit" ? selectedItems[0].collection_name : "",
    },
  });

  useEffect(() => {
    if (!openModal) return; // 🔥 KEY FIX

    if (action === "edit" && selectedItems[0]) {
      const fetchCollection = async () => {
        const res = await loadData({
          url: `${endpoints.Collections}?collection_id=${selectedItems[0].collection_id}`,
          setLoading: setIsLoading,
          //   accessToken: token.access_token,
        });

        form.reset({
          collection_name: res?.data.result.collection_name,
        });
      };

      fetchCollection();
    }

    if (action === "add") {
      form.reset({
        collection_name: "",
      });
    }
  }, [action, selectedItems, openModal, form]);

  const handleClose = () => {
    setOpenModal(false);
    setAction("");
  };

  const onSubmit = async (data: catagoryForm) => {
    const payload = {
      collection_name: data.collection_name,
    };
    if (action === "add") {
      const params = {
        url: `${endpoints.Collections}`,
        setLoading: setIsSubmitting,
        payload,
        isToast: true,
        // accessToken: token.access_token,
      };
      const res = await postData(params);
      console.log(res);
      if (res?.status === 201) {
        setState((prev) => prev + 1);
        form.reset();
        handleClose();
      }
    } else {
      const params = {
        url: `${endpoints.Collections}?collection_id=${selectedItems[0].collection_id}`,
        setLoading: setIsSubmitting,
        payload,
        isToast: true,
        // accessToken: token.access_token,
      };
      console.log(params);
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
      {action && openModal && catalogType === "collection" && (
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
                    {/* Category Name */}
                    <Controller
                      name="collection_name"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="form-rhf-demo-title">
                            Collection Name
                          </FieldLabel>
                          <Input
                            {...field}
                            id="form-rhf-demo-title"
                            aria-invalid={fieldState.invalid}
                            placeholder="Spring 2026"
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
