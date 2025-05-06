"use client";

import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {adminSchema, adminUpdateSchema} from "@/schemas/admin-schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {useRouter} from "next/navigation";
import {Eye, EyeOff} from "lucide-react";
import {getCookie} from "@/app/lib/cookies";
import {toast} from "react-hot-toast";

export default function AdminForm({initialData = null, setProducts=null, setSheetOpen = null}) {
  const router = useRouter();
  const isEditMode = !!initialData;
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const {
    reset,
    watch,
    setValue,
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm({
    resolver: zodResolver(isEditMode ? adminUpdateSchema : adminSchema),
    defaultValues: {
      name: initialData?.username || "",
      email: initialData?.email || "",
      role: initialData?.roles[0].name || "admin",
      password: "",
      confirmPassword: "",
    },
  });

  const onRoleChange = (value) => {
    setValue("role", value);
  };

  const role = watch("role");

  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = getCookie("token");
        if (!token) {
          toast.error("No token found!");
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            'ngrok-skip-browser-warning': 'true'
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch roles");
        }

        const res = await response.json();
        if (res && res.data) {
          setRoles(res.data.roles);
        }
      } catch (error) {
        toast.error("Failed to fetch roles. Please try again.");
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
      formData.append("username", data.name);
      formData.append("email", data.email);
      formData.append("role_id", +data.role);
      formData.append("password", data.password);
      formData.append("password_confirmation", data.confirmPassword);

      let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admins`;
      let method = "POST";

      if (isEditMode) {
        apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admins/${initialData.id}?_method=PATCH`;
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
        setProducts((prevAdmins) =>
          isEditMode
            ? prevAdmins.map((admin) => (admin.id === res.data.admin.id ? res.data.admin : admin))
            : [res.data.admin, ...prevAdmins]
        );
      }
      if (setSheetOpen) setSheetOpen(false);
      reset();
      router.push("/admins/all");
    } catch (error) {
      toast.error(error.message || "Error submitting form. Please try again.");
    }
  };

  return (
    <div className="max-w-5xl w-full mx-auto pt-4 bg-background rounded-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">
            User Name<span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="name"
            disabled={isEditMode}
            {...register("name")}
            placeholder="Enter admin name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">
            Email<span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="email"
            disabled={isEditMode}
            {...register("email")}
            placeholder="Enter admin email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="role">Role</Label>
          <Select
            value={selectedRole}
            onValueChange={(value) => {
              setSelectedRole(value);
              onRoleChange(value);
            }}
          >
            <SelectTrigger id="role">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id.toString()}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <Label htmlFor="password">
            Password<span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="relative">
            <Input
              id="password"
              disabled={isEditMode}
              {...register("password")}
              placeholder="Enter password"
              type={showPassword ? "text" : "password"}
              className="w-full pr-10"
            />
            {!isEditMode && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-2"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              disabled={isEditMode}
              {...register("confirmPassword")}
              placeholder="Confirm password"
              type={showConfirmPassword ? "text" : "password"}
              className="w-full pr-10"
            />
            {!isEditMode && (
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-2"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit and Cancel Buttons */}
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
                : "Create Admin"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              router.push("/admins/all");
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
