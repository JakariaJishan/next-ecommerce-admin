import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export default function SellerProfileSection({seller}) {
  const firstLetters = seller.username?.split(" ").map(word=> word[0]).join("").toUpperCase();
  console.log(seller)
  return (
    <Card className="w-full rounded-t-lg overflow-hidden shadow-none md:shadow  border-none ">
      {/* Cover Image */}
      <div className="h-52 bg-[url('/logo/seller-background.png')] bg-cover bg-blue-500 bg-center relative"></div>

      {/* Profile Info Section */}
      <CardContent className="relative -mt-12 px-6">
        <div className="flex items-center justify-between">
          {/* Profile Image and Details */}
          <div className="flex items-end gap-4">
            {
              seller.media?.[0]?.original_url ? (
                <Avatar className="h-24 w-24 rounded">
                  <AvatarImage src={seller.media?.[0]?.original_url} alt="Profile Picture"/>
                  <AvatarFallback className={"rounded"}>{firstLetters}</AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="h-24 w-24 rounded">
                  <AvatarFallback className={"rounded"}>{firstLetters}</AvatarFallback>
                </Avatar>
              )
            }
            <div>
              <h2 className="text-xl font-medium">{seller.username}</h2>
              <p className="text-sm text-gray-400">{seller.email}</p>
            </div>
          </div>

          {/*/!* Actions Dropdown *!/*/}
          {/*<DropdownMenu>*/}
          {/*  <DropdownMenuTrigger asChild>*/}
          {/*    <Button variant="outline" className="flex items-center gap-2">*/}
          {/*      Actions <ChevronDown className="h-4 w-4" />*/}
          {/*    </Button>*/}
          {/*  </DropdownMenuTrigger>*/}
          {/*  <DropdownMenuContent align="end">*/}
          {/*    <DropdownMenuItem>Edit Profile</DropdownMenuItem>*/}
          {/*    <DropdownMenuItem>View Reports</DropdownMenuItem>*/}
          {/*    <DropdownMenuItem>Logout</DropdownMenuItem>*/}
          {/*  </DropdownMenuContent>*/}
          {/*</DropdownMenu>*/}
        </div>

        {/* Profile Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 border-t pt-4 text-sm text-info-gray">
          {/* Total Sales */}
          <div className={"leading-6"}>
            <div>
              <p>Total Revenue:</p>
              <p className="text-green-600 font-semibold">{seller.total_revenue}</p>
            </div>
            <div>
              <p>Total Sales:</p>
              <p className="text-green-600 font-semibold">{seller.sold_ads_count}</p>
            </div>
          </div>


          {/* Contacts */}
          <div className={"leading-6"}>
            <p className="font-semibold">Contacts</p>
            <p>Manager: {seller.username}</p>
            <p>{seller.email}</p>
            <p>Phone: {seller.phone}</p>
          </div>


        </div>
      </CardContent>
    </Card>
  );
}
