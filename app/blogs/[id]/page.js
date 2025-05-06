"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-hot-toast";
import {getCookie} from "@/app/lib/cookies";
import Loader from "@/app/lib/Loader";
import {useApiRequest} from "@/app/hooks/useApiRequest";

const page = () => {
  const { id } = useParams(); // Get blog ID from URL
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/blog-posts/${id}`;
  const {makeRequest, loading, error} = useApiRequest();
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const token = getCookie("token");
        const response = await makeRequest({
          url: apiUrl,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        });
        const data = response.data || {};
        setBlog(data.blog_post);
      } catch (err) {
        toast.error("Error fetching product details");
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) return <Loader/>;
  if (!blog) return <p>No blog data found</p>;
  return (
    <div className="max-w-4xl mx-auto py-10">
      {loading ? (
        <Skeleton className="h-40 w-full rounded-lg mb-4" />
      ) : blog ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{blog.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Blog ID: {blog.id}</p>
            <div
              className="mt-4 text-lg leading-relaxed "
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </CardContent>
        </Card>
      ) : (
        <p className="text-center text-red-500">Blog post not found</p>
      )}

      {/* Back Button */}
      <div className="mt-6 flex justify-center">
        <Button className={"bg-primary dark:bg-[#009EF7] text-white"} onClick={() => router.push("/blogs/all")}>Back to Blogs</Button>
      </div>
    </div>
  );
};

export default page;
