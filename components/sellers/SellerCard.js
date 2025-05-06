import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function SellerCard({seller}) {
  const firstLetters = seller.username?.split(" ").map(word=> word[0]).join("").toUpperCase();

  return (
    <Card className="rounded-xl overflow-hidden  dark:border-gray-400">
      {/* Background Cover */}
      <div className="h-20 bg-[url('/logo/seller-card-bg.png')] bg-cover bg-[#494B74] bg-center"></div>

      {/* Profile Picture */}
      <div className="flex justify-center -mt-8">
        {
          seller.media?.[0]?.original_url ? (
            <Avatar className="h-16 w-16 border-1 border-white shadow-md">
              <AvatarImage src={seller.media?.[0]?.original_url} alt="Profile Picture"/>
              <AvatarFallback>{firstLetters}</AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="h-16 w-16 border-1 border-white shadow-md">
              <AvatarFallback>{firstLetters}</AvatarFallback>
            </Avatar>
          )
        }
      </div>

      {/* User Info */}
      <CardContent className="text-center py-4 leading-8">
        <h2 className="text-lg font-medium">{seller.username}</h2>
        <p className="text-md text-gray-400">Seller ID: #{seller.id}</p>
        <p className="text-md text-gray-400">{seller.email}</p>
      </CardContent>

      {/* View Profile Button */}
      <CardFooter className="flex justify-center pb-4">
        <Link href={`/sellers/${seller.id}`}>
          <Button className={"dark:bg-card dark:text-[#009EF7]"}>
            View Profile
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}