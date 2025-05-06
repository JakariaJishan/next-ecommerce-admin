"use client";
import { categorySchema } from "@/schemas/category-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {getCookie} from "@/app/lib/cookies";
import {toast} from "react-hot-toast";
import {useRouter} from "next/navigation";

const CategoryForm = ({ initialData = null, setProducts=null, setSheetOpen=null }) => {
  const isEditMode = !!initialData; // Check if editing or creating
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      parent_name: "",
      description: "",
      created_at: new Date().toISOString().slice(0, 16), // Default current datetime
    },
  });

  // If initialData exists, populate the form with it
  useEffect(() => {
    if (initialData) {
      setValue("name", initialData.name);
      setValue("parent_name", initialData.parent_name || "");
      setValue("description", initialData.description);
      setValue("created_at", initialData.created_at);
    }
  }, [initialData, setValue]);

  const handleFormSubmit = async (data) => {
    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("No token found!");
        return;
      }

      // Create FormData for request
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      if (data.parent_name) formData.append("parent_name", data.parent_name);

      let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/categories`;
      let method = "POST";

      if (isEditMode) {
        apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/categories/${initialData.id}?_method=PATCH`;
        method = "POST"; // Use PATCH for updates
      }

      const response = await fetch(apiUrl, {
        method,
        headers: {
          Authorization: `Bearer ${token}`, // Do NOT set Content-Type when using FormData
          Accept: "application/json",
        },
        body: formData,
      });

      const res = await response.json();
      if(!res.success) throw new Error(res.message || "Failed to process request");
      toast.success(res.message);
      if (res && setProducts) {
        setProducts((prevCategories) =>
         isEditMode
          ? prevCategories.map((category) =>
            category.id === res.data.category.id ? res.data.category : category
          )
          : [res.data.category, ...prevCategories]
        );
      }
      if (setSheetOpen) setSheetOpen(false);
      reset(); // Reset form after successful submission
    } catch (error) {
      toast.error(error.message || "Error submitting form. Please try again.");
    }
  };

  return (
    <div className="max-w-5xl w-full mx-auto pt-4  rounded-lg ">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="grid grid-cols-1 gap-4 mt-4"
      >
        {/* Name Input */}
        <div>
          <Label htmlFor="name">Name<span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter category name"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Parent Name Input */}
        <div>
          <Label htmlFor="parent_name">Parent Name</Label>
          <Input
            id="parent_name"
            type="text"
            placeholder="Enter parent category (optional)"
            {...register("parent_name")}
          />
          {errors.parent_name && (
            <p className="text-red-500 text-sm">{errors.parent_name.message}</p>
          )}
        </div>

        {/* Description Input */}
        <div>
          <Label htmlFor="description">Description<span className="text-red-500 ml-1">*</span></Label>
          <Textarea
            id="description"
            type="text"
            placeholder="Enter category description"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
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
                : "Create Admin"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              router.push("/categories/all");
              if (setSheetOpen) setSheetOpen(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
