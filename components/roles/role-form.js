"use client";

import {Controller, useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { roleSchema } from "@/schemas/role-schema"; // Make sure to define this schema
import { useRouter } from "next/navigation";
import {getCookie} from "@/app/lib/cookies";
import {toast} from "react-hot-toast";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {permissionTypes} from "@/schemas/permission-schema";
import {useEffect, useState} from "react";
import {Checkbox} from "@/components/ui/checkbox";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {CircleCheck} from "lucide-react";
import {ScrollArea} from "@/components/ui/scroll-area";

export default function RoleForm({ initialData = null, setSheetOpen = null, setProducts = null }) {
  const router = useRouter();
  const isEditMode = !!initialData;
  const [permissions, setPermissions] = useState([]);

  const {
    control,
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      permissions: initialData?.permissions
        ? initialData.permissions?.map((perm) =>
          typeof perm === "object" ? perm.id.toString() : perm
        )
        : [],
    },
  });

  // If initialData is loaded asynchronously, update the form state
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description,
        permissions: initialData.permissions?.map((perm) =>
          typeof perm === "object" ? perm.id.toString() : perm
        ),
      });
    }
  }, [initialData, reset, setSheetOpen]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = getCookie("token");
        if (!token) {
          toast.error("No token found!");
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/permissions?per_page=50`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            'ngrok-skip-browser-warning': 'true'
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch permissions");
        }

        const res = await response.json();
        if (res && res.data) {
          setPermissions(res.data.permissions);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch permissions. Please try again.");
      }
    }
    fetchRoles();
  }, []);

  const onSubmit = async (data) => {
    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("No token found!");
        return;
      }
      // Create FormData
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("permission_ids", JSON.stringify(data.permissions));

      let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/roles`;
      let method = "POST";

      if (isEditMode) {
        apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/roles/${initialData.id}?_method=PATCH`;
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
      if (!res.success) throw new Error(res.message || "Failed to process request");
      toast.success(res.message);

      if (res && setProducts) {
        setProducts((prevRoles) =>
          isEditMode
            ? prevRoles.map((role) => (role.id === res.data.role.id ? res.data.role : role))
            : [res.data.role, ...prevRoles]
        );
      }
      if (setSheetOpen) setSheetOpen(false);
      reset();
      router.push("/roles/all");
    } catch (error) {
      toast.error(error.message || "Error submitting form. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto pt-4 bg-background rounded-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">
            Role Name<span className="text-red-500 ml-1">*</span>
          </Label>
          <Input id="name" {...register("name")} placeholder="Enter role name" />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">
            Description<span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="description"
            {...register("description")}
            placeholder="Enter role description"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Permissions as Checkboxes */}
        <div className="space-y-2">
          <Label>Permissions</Label>
          <Controller
            control={control}
            name="permissions"
            render={({ field: { value = [], onChange } }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full h-fit text-left font-normal">
                    {value.length > 0
                      ? permissions
                        .filter((p) => value.includes(p.id.toString()))
                        .map((p) => <div key={p.id} className={"flex items-center gap-2"}> <CircleCheck size={15} color={"green"}/> {p.resource}</div>)
                      : "Select permissions"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="">
                  <ScrollArea className="flex flex-col space-y-2 h-72 ">
                    {permissions.map((perm, idx) => (
                      <label key={idx} className="flex items-center gap-2">
                        <Checkbox
                          checked={value.includes(perm.id.toString())}
                          onCheckedChange={(checked) => {
                            let newValue = Array.isArray(value) ? value : [];
                            if (checked) {
                              newValue = [...newValue, perm.id.toString()];
                            } else {
                              newValue = newValue.filter((id) => id !== perm.id.toString());
                            }
                            onChange(newValue);
                          }}
                        />
                        <span>{perm.resource}</span>
                      </label>
                    ))}
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.permissions && (
            <p className="text-red-500 text-sm mt-1">{errors.permissions.message}</p>
          )}
        </div>


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
                : "Create Role"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              router.push("/roles/all");
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
