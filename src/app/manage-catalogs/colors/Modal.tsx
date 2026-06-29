"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { IColor } from "@/store/slices/catalogSlice";
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
  selectedItems: IColor[];
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

  const ColorSchema = z.object({
    color_name: z.string().min(1, "Color name is required"),
  });

  type colorForm = z.infer<typeof ColorSchema>;

  const form = useForm<colorForm>({
    resolver: zodResolver(ColorSchema),
    defaultValues: {
      color_name: action === "edit" ? selectedItems[0].color_name : "",
    },
  });

  useEffect(() => {
    if (!openModal) return; // 🔥 KEY FIX

    if (action === "edit" && selectedItems[0]) {
      const fetchColor = async () => {
        const res = await loadData({
          url: `${endpoints.Colors}?color_id=${selectedItems[0].color_id}`,
          setLoading: setIsLoading,
          //   accessToken: token.access_token,
        });

        form.reset({
          color_name: res?.data.result.color_name,
        });
      };

      fetchColor();
    }

    if (action === "add") {
      form.reset({
        color_name: "",
      });
    }
  }, [action, selectedItems, openModal, form]);

  const handleClose = () => {
    setOpenModal(false);
    setAction("");
  };

  const onSubmit = async (data: colorForm) => {
    const payload = {
      color_name: data.color_name,
    };
    if (action === "add") {
      const params = {
        url: `${endpoints.Colors}`,
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
        url: `${endpoints.Colors}?color_id=${selectedItems[0].color_id}`,
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
      {action && openModal && catalogType === "color" && (
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
                      name="color_name"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="form-rhf-demo-title">
                            Color Name
                          </FieldLabel>
                          <Input
                            {...field}
                            id="form-rhf-demo-title"
                            aria-invalid={fieldState.invalid}
                            placeholder="Red"
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
