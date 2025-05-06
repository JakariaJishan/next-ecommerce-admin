"use client"
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {Ellipsis, Heart} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {useEffect, useState} from "react";
import Loader from "@/app/lib/Loader";
import {useApiRequest} from "@/app/hooks/useApiRequest";
import {getCookie} from "@/app/lib/cookies";
import Image from "next/image";

export default function ProductCard({sellerAds}) {
  const [wishlist, setWishlist] = useState(false);

  return (
    <div className={"grid grid-cols-1 md:grid-cols-4 gap-8 pb-6"}>
      {
        sellerAds?.map((ad, index) => (
          <Card key={ad.id} className="max-w-[400px] w-full p-4 rounded-lg relative">
            {/* Wishlist Button */}
            <CardHeader className={"p-0 flex flex-row items-center justify-between"}>
              <button
                className={` p-1 rounded-full ${
                  wishlist ? "text-red-500" : "text-gray-400"
                }`}
                onClick={() => setWishlist(!wishlist)}
              >
                <Heart className="h-5 w-5" fill={wishlist ? "red" : "none"} />
              </button>

              {/* More Options Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className=" text-gray-400">
                    <Ellipsis className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Add to Cart</DropdownMenuItem>
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Share</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>

            {/* Product Image */}
            <CardContent className="flex justify-center pt-6">
              <Image
                src={ad.media?.[0]?.original_url || "/"}
                alt={ad.title || "ad Image"}
                width={200}
                height={200}
                className="h-24 w-full object-cover"
              />
            </CardContent>

            {/* Product Info */}
            <CardFooter className="flex flex-col items-start p-0">
              <p className="text-gray-500 text-sm">{ad.title}</p>
              <p className="text-lg font-medium">$450</p>
            </CardFooter>
          </Card>
        ))
      }
    </div>
  );
}
