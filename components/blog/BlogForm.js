"use client";

import { blogSchema } from "@/schemas/blog-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import dynamic from "next/dynamic";
import { getCookie } from "@/app/lib/cookies";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

// Dynamically import React Quill (Prevents SSR issues)
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const BlogForm = ({ initialData = null, setProducts = null, setSheetOpen=null }) => {
  const isEditMode = !!initialData;
  const [content, setContent] = useState(initialData?.content || "");
  const router = useRouter(); // Use Next.js router for navigation

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
      content: initialData?.content || "",
      status: initialData?.status || "draft",
    },
  });

  // Sync form with initial data when in edit mode
  useEffect(() => {
    if (isEditMode && initialData) {
      setValue("title", initialData.title);
      setValue("content", initialData.content);
      setValue("status", initialData.status);
    }
    register("content", { required: "Content is required" });
    register("status", { required: "Status is required" });
  }, [isEditMode, initialData, register, setValue]);

  const onEditorStateChange = (editorState) => {
    setValue("content", editorState);
  };

  const onStatusChange = (status) => {
    setValue("status", status);
  };

  const editorContent = watch("content");
  const status = watch("status");

  // Form Submit Handler
  const handleFormSubmit = async (data) => {
    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("No token found!");
        return;
      }

      if (!data.content || data.content.trim() === "<p><br></p>") {
        toast.error("Content cannot be empty.");
        return;
      }

      // Create FormData
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("status", data.status);

      let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/blog-posts`;
      let method = "POST";

      if (isEditMode) {
        apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/blog-posts/${initialData.id}?_method=PATCH`;
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
        setProducts((prevBlogs) =>
          isEditMode
            ? prevBlogs.map((blog) => (blog.id === res.data.blog_post.id ? res.data.blog_post : blog))
            : [res.data.blog_post, ...prevBlogs]
        );
      }
      if (setSheetOpen) setSheetOpen(false);
      reset();
      setContent(""); // Reset rich text content
      router.push("/blogs/all"); // Redirect properly using Next.js router
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
            placeholder="Enter blog title"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        {/* Content (Rich Text Editor) */}
        <div>
          <Label htmlFor="content">Content <span className="text-red-500 ml-1">*</span></Label>
          <ReactQuill
            theme="snow"
            value={editorContent}
            onChange={onEditorStateChange}
            className="h-60 bg-background rounded mb-10"
          />
          {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
        </div>

        {/* Status Input */}
        <div className={"mt-4 md:mt-0"}>
          <Label htmlFor="status">Status</Label>
          <Select onValueChange={onStatusChange} defaultValue={status || "draft"}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button type="submit" onClick={handleSubmit(handleFormSubmit)} disabled={isSubmitting} className="bg-primary dark:bg-[#009EF7] text-white">
            {isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Create Blog"}
          </Button>

          <Button type="button" variant="outline" onClick={() => {
            router.push("/blogs/all")
            if(setSheetOpen) setSheetOpen(false);
          }}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogForm;
