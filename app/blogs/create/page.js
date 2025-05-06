"use client"
import BlogForm from "@/components/blog/BlogForm";
import {useState} from "react";

export default function CreateBlog(){
  const [blogs, setBlogs] = useState([])

  return(
    <div className={"p-6 pb-0 md:p-0 md:pb-6"}>
      <h2 className="text-2xl font-medium">Create Blog</h2>
      <BlogForm setBlogs={setBlogs}/>
    </div>
  )
}