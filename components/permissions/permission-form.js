"use client";

import {useForm, Controller} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {allowedActions, permissionSchema, permissionTypes} from "@/schemas/permission-schema";

// UI components
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {getCookie} from "@/app/lib/cookies";
import {toast} from "react-hot-toast";
import {useState} from "react";

export default function PermissionForm({initialData = null, setSheetOpen = null, setProducts = null, fromRole=false}) {
  const router = useRouter();
  const isEditMode = !!initialData;

  const {
    reset,
    register,
    handleSubmit,
    control,
    formState: {errors, isSubmitting},
  } = useForm({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      description: initialData?.description || "",
      permissionType: initialData?.resource || "admin",
      action: initialData?.action || ['view'],
    },
  });

  const onSubmit = async (data) => {
    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("No token found!");
        return;
      }
      // Create FormData
      const formData = new FormData();
      formData.append("description", data.description);
      formData.append("resource", data.permissionType);
      formData.append("action", JSON.stringify(data.action));

      let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/permissions`;
      let method = "POST";

      if (isEditMode) {
        apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/permissions/${initialData.id}?_method=PATCH`;
        method = "POST";
      }

      const response = await fetch(apiUrl, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      const res = await response.json();

      if (!res.success) {
        throw new Error(res.message || "Failed to process request");
      }

      toast.success(res.message);

      if (res && setProducts) {
        setProducts((prevPermissions) =>
          isEditMode
            ? prevPermissions.map((permission) => (permission.id === res.data.permission.id ? res.data.permission : permission))
            : [res.data.permission, ...prevPermissions]
        );
      }
      if (setSheetOpen) setSheetOpen(false);
      reset();
      router.push(!fromRole && "/permissions/all");
    } catch (error) {
      toast.error(error.message || "Error submitting form. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto pt-4 bg-background rounded-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Description */}
        <div>
          <Label htmlFor="description">
            Description<span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="description"
            placeholder="Enter permission description"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Permission Type Dropdown */}
        <div>
          <Label>Permission Type</Label>
          <Controller
            name="permissionType"
            control={control}
            render={({field}) => (
              <Select
                value={field.value}
                onValueChange={(value) => field.onChange(value)}
              >
                <SelectTrigger className="w-full text-left" variant="outline">
                  <SelectValue placeholder="Select Permission Type"/>
                </SelectTrigger>
                <SelectContent>
                  {permissionTypes.map((type, idx) => (
                    <SelectItem key={idx} value={type} className="capitalize">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Conditionally show permissions */}
        <div className="space-y-2">
          <Label>Permissions</Label>
          <div className="flex items-center gap-3">
            {allowedActions.map((action, idx) => (
              <div key={idx}>
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    value={action}
                    {...register("action")}
                  />
                  {action}
                </label>
              </div>
            ))}
          </div>
          {errors.action && (
            <p className="text-red-500 text-sm mt-1">{errors.action.message}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary dark:bg-[#009EF7] text-white"
          >
            {isSubmitting
              ? "Saving..."
              : isEditMode
                ? "Save Changes"
                : "Create Permission"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              router.push(!fromRole && "/permissions/all");
              if (setSheetOpen) setSheetOpen(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
