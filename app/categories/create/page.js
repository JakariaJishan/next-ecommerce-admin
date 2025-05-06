"use client"
import CategoryForm from "@/components/category/category-form";
import {useRouter} from "next/navigation";

export default function page() {
  const router = useRouter();
  const handleCreateCategory = async (categoryData) => {
    router.push("/categories/all");
  };
    return (
        <div className={"p-6 pb-0 md:p-0 md:pb-6"}>
            <h2 className="text-2xl font-medium">Create Category</h2>
           <CategoryForm onSubmit={handleCreateCategory}/>
        </div>
    );
}