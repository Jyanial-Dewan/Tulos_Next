"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { endpoints } from "@/variables/variables";
import { postData } from "@/utility/httpRequest";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";

export const userSchema = z.object({
  username: z.string().min(1, "Username is required"),

  user_type: z.enum(["admin", "user"], {
    message: "User type must be either admin or user",
  }),

  email: z.email("Invalid email address"),

  phone: z.string().min(1, "Phone is required").optional(),

  first_name: z.string().min(1, "First name is required"),

  last_name: z.string().min(1, "Last name is required"),

  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function Register() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      user_type: "user",
      email: "",
      phone: "",
      first_name: "",
      last_name: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof userSchema>) => {
    const payload = {
      ...data,
      phone: [data.phone],
    };
    const params = {
      url: endpoints.Register,
      setLoading: setIsSubmitting,
      payload,
      isConsole: true,
      isToast: true,
      // accessToken?: string;
    };

    await postData(params);
  };
  return (
    <div className="flex w-full justify-center items-center my-6">
      <Card className="w-[80%] md:md:w-180 mx-auto ">
        <CardHeader>
          <CardTitle>Register an account</CardTitle>
          <CardDescription>Provide your personal information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="grid md:grid-cols-2">
              {/* Username */}
              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-title">
                      Username
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Jyanial"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* User Type */}
              <Controller
                name="user_type"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>User Type</FieldLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Select user type" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* Email */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-title">Email</FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="jd@gmail.com"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* Phone */}
              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Phone</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="01625477208"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* First Name */}
              <Controller
                name="first_name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-title">
                      First Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Jyanial"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* Last Name */}
              <Controller
                name="last_name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-title">
                      Last Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Dewan"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* Password */}
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">Password</FieldLabel>

                    <div className="relative">
                      <Input
                        {...field}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter password"
                        autoComplete="off"
                        className="pr-10"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal" className="flex justify-end">
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
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
