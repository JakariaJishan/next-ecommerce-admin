"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { getCookie } from "@/app/lib/cookies";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import dynamic from "next/dynamic";

// Dynamically import React Quill (Prevents SSR issues)
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const ContestForm = ({ initialData = null, setProducts = null, setSheetOpen=null }) => {
  const isEditMode = !!initialData;
  const [description, setDescription] = useState(initialData?.description || "");
  const router = useRouter();
  const {
    watch,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      start_date: initialData?.start_date || "",
      end_date: initialData?.end_date || "",
      status: initialData?.status || "active",
    },
  });

  useEffect(() => {
    if (isEditMode && initialData) {
      setValue("title", initialData.title);
      setValue("description", initialData.description);
      setValue("start_date", initialData.start_date);
      setValue("end_date", initialData.end_date);
      setValue("status", initialData.status);
    }
    register("description", { required: "Description is required" });
    register("status", { required: "Status is required" });
  }, [isEditMode, initialData, register, setValue]);

  const onEditorStateChange = (editorState) => {
    setValue("description", editorState);
  };

  const onStatusChange = (status) => {
    setValue("status", status);
  };

  const editorContent = watch("description");
  const status = watch("status");

  const handleFormSubmit = async (data) => {
    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("No token found!");
        return;
      }

      if (!data.description || data.description.trim() === "<p><br></p>") {
        toast.error("Description cannot be empty.");
        return;
      }

      // Create FormData
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("start_date", data.start_date);
      formData.append("end_date", data.end_date);
      formData.append("status", data.status);

      let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/contests`;
      let method = "POST";

      if (isEditMode) {
        apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/contests/${initialData.id}?_method=PATCH`;
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
        setProducts((prevContests) =>
          isEditMode
            ? prevContests.map((contest) => (contest.id === res.data.contest.id ? res.data.contest : contest))
            : [res.data.contest, ...prevContests]
        );
      }
      if (setSheetOpen) setSheetOpen(false);
      reset();
      setDescription("");
      router.push("/contests/all");
    } catch (error) {
      toast.error(error.message || "Error submitting form. Please try again.");
    }
  };

  return (
    <div className="max-w-5xl w-full mx-auto pt-4  rounded-lg">
      <div className="grid grid-cols-1 gap-4 mt-4">
        {/* Title Input */}
        <div>
          <Label htmlFor="title">Title <span className="text-red-500 ml-1">*</span></Label>
          <Input
            id="title"
            type="text"
            placeholder="Enter contest title"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        {/* Description (Rich Text Editor) */}
        <div>
          <Label htmlFor="description">Description <span className="text-red-500 ml-1">*</span></Label>
          <ReactQuill
            theme="snow"
            value={editorContent}
            onChange={onEditorStateChange}
            className="h-60 bg-background rounded mb-10"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>
        <div className={"flex flex-col md:flex-row gap-4 mt-4 md:mt-0"}>
          {/* Start Date */}
          <div>
            <Label htmlFor="start_date">Start Date <span className="text-red-500 ml-1">*</span></Label>
            <Input
              id="start_date"
              type="datetime-local"
              min={new Date().toISOString().slice(0, 16)}
              className={"w-fit"}

              {...register("start_date", { required: "Start date is required" })}
            />
            {errors.start_date && <p className="text-red-500 text-sm">{errors.start_date.message}</p>}
          </div>
          {/* End Date */}
          <div>
            <Label htmlFor="end_date">End Date <span className="text-red-500 ml-1 text-xs">*</span></Label>
            <Input
              id="end_date"
              type="datetime-local"
              min={new Date().toISOString().slice(0, 16)}
              className={"w-fit"}
              {...register("end_date", { required: "End date is required" })}
            />
            {errors.end_date && <p className="text-red-500 text-sm">{errors.end_date.message}</p>}
          </div>
        </div>

        {/* Status Selection */}
        <div>
          <Label htmlFor="status">Status</Label>
          <Select onValueChange={onStatusChange} defaultValue={status || "active"}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary dark:bg-[#009EF7] text-white"
            onClick={handleSubmit(handleFormSubmit)}
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
              router.push("/contests/all");
              if (setSheetOpen) setSheetOpen(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContestForm;
