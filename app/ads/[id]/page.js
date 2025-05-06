'use client'

import Image from 'next/image';
import {useApiRequest} from "@/app/hooks/useApiRequest";
import {getCookie} from "@/app/lib/cookies";
import Loader from "@/app/lib/Loader";
import DummyStarIcon from "@/components/product/DummyStarIcon";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {toast} from "react-hot-toast";
import {FormatTime} from "@/app/lib/formatted-time";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export default function page() {
  const {id} = useParams();
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/ads/${id}`;
  const {makeRequest, loading, error} = useApiRequest();
  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const router = useRouter();

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
        setProductData(data.ad);
        if (data?.ad?.media?.length > 0) {
          setSelectedImage(data.ad.media[0].original_url); // Default to first image
        }
      } catch (err) {
        toast.error("Error fetching product details");
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) return <Loader/>;
  if (!productData) return;

  const {
    title,
    description,
    price,
    currency,
    status,
    moderation_status,
    created_at,
    updated_at,
    expiration_data,
    user,
    media,
  } = productData;

  return (
    <>
      <div className="flex justify-between items-center p-6 pb-0 md:p-0 md:pb-6">
        <h2 className="text-2xl font-medium">Ad Details</h2>
      </div>
      <div className="flex flex-col md:flex-row justify-center gap-8 p-4 pt-8">
        {/* Image Section */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 ">
          {/* Thumbnail list */}
          <div className="hidden md:flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 h-auto md:h-[400px] overflow-x-auto md:overflow-y-auto scrollbar-hidden">
            {media.length > 0 ? (
              media.map((image, index) => (
                <div
                  key={index}
                  className={`relative w-24 sm:w-32 h-24 sm:h-32 cursor-pointer border-2 rounded-lg flex-none
            ${selectedImage === image.original_url ? "border-[#22C38F]" : "border-[#E8E9EA]"}`}
                  onClick={() => setSelectedImage(image.original_url)}
                >
                  <Image
                    src={image.original_url}
                    alt={`Product Image ${index + 1}`}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              ))
            ) : (
              <p>No images available</p>
            )}
          </div>
          {/* Main image display */}
          <div className="flex md:justify-center w-full md:w-auto">
            <div className="relative w-full md:w-[384px] h-[300px] sm:h-[399px] flex justify-center rounded-lg border border-gray-200">
              <div className="w-full h-full relative">
                {selectedImage ? (
                  <Image
                    src={selectedImage}
                    alt="Selected Product Image"
                    fill
                    className="rounded-lg object-cover w-full"
                  />
                ) : (
                  <p>No image available</p>
                )}
              </div>
            </div>
          </div>
          {/* Thumbnail list Mobile*/}
          <div className="flex md:hidden flex-row max-w-sm space-x-2 h-auto overflow-x-auto scrollbar-hidden whitespace-nowrap">
            {media.length > 0 ? (
              media.map((image, index) => (
                <div
                  key={index}
                  className={`relative w-24 sm:w-32 h-24 sm:h-32 cursor-pointer border-2 rounded-lg flex-none
          ${selectedImage === image.original_url ? "border-[#22C38F]" : "border-[#E8E9EA]"}`}
                  onClick={() => setSelectedImage(image.original_url)}
                >
                  <Image
                    src={image.original_url}
                    alt={`Product Image ${index + 1}`}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              ))
            ) : (
              <p>No images available</p>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col rounded-lg w-full md:w-[565px] gap-[15px]">
          <div className="text-[24px] font-medium">{title}</div>
          <p className="text-[22px] font-medium">
            {price && `$${price} ${currency.toUpperCase()}`}
          </p>
          <div className="flex items-center gap-[10px]">
            <span className="text-[12px] text-[#949CA9] font-normal">520 customer reviews</span>
            <DummyStarIcon/>
          </div>
          <p className="text-[14px] text-[#949CA9] font-normal max-h-[100px] overflow-y-auto break-words truncate">
            {description}
          </p>
          <p className="text-[14px] text-[#949CA9] font-medium">Status: {status}</p>
          <p className="text-[14px] text-[#949CA9] font-medium">Moderation: {moderation_status}</p>
          <p className="text-[14px] text-[#949CA9] font-medium">Created At: {FormatTime(created_at)}</p>
        </div>
      </div>

        {/* Tabs: Description, Information */}
      <div className="mt-4 p-4">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="flex space-x-4 mb-4 justify-start bg-transparent shadow-none border-none">
            <TabsTrigger value="description" className={"rounded-none shadow-none"}>Description</TabsTrigger>
            <TabsTrigger value="information" className={"rounded-none shadow-none"}>Information</TabsTrigger>
          </TabsList>

          {/* Description Tab */}
          <TabsContent value="description">
            <p className="text-[14px] text-info-gray font-normal break-words">
              {description}
            </p>
          </TabsContent>

          {/* Information Tab */}
          <TabsContent value="information">
            <div className="p-4 text-info-gray">
              <h3 className="text-lg font-semibold">Product Information</h3>
              <p className="text-sm"><strong>Sale Status:</strong> {status}</p>
              <p className="text-sm"><strong>Moderation:</strong> {moderation_status}</p>
              <p className="text-sm"><strong>Created At:</strong> {FormatTime(created_at)}</p>
              <p className="text-sm"><strong>Updated At:</strong> {FormatTime(updated_at)}</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Seller Information */}
      <div className="mt-8 p-4">
        <h2 className="text-lg font-medium mb-2">Seller Information</h2>
        <div className="flex items-center space-x-4 p-4 border rounded-lg">
          <Avatar className={"h-20 w-20 rounded-full"}>
            <AvatarImage src={user?.media?.[0]?.original_url || "/default-avatar.png"}
                         alt={user?.username || "User Avatar"} className={"object-cover"}/>
            <AvatarFallback>{user?.username?.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
          </Avatar>
          <div className={"leading-8"}>
            <p className="text-md font-medium">{user?.username}</p>
            <p className="text-sm text-[#949CA9] py-2">{user?.email}</p>
            {user?.phone && <p className="text-sm text-[#949CA9]">📞 {user?.phone}</p>}
          </div>
        </div>
      </div>
    </>
  );
}
