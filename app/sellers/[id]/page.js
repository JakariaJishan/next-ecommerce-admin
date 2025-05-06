"use client"
import SellerProfileSection from "@/components/sellers/SellerProfileSection";
import ProductCard from "@/components/product/ProductCard";
import {useApiRequest} from "@/app/hooks/useApiRequest";
import {useEffect, useState} from "react";
import {getCookie} from "@/app/lib/cookies";
import Loader from "@/app/lib/Loader";
import {useParams} from "next/navigation";
import {usePagination} from "@/app/hooks/usePagination";
import Pagination from "@/components/pagination/Pagination";

export default function page() {
  const {id} = useParams();
  const {makeRequest, loading, error} = useApiRequest();
  const [seller, setSeller] = useState([]);
  const [ads, setAds] = useState([]);
  const {currentPage, totalPages, handlePageClick, updateTotalPages, setCurrentPage, totalItems} = usePagination();

  useEffect(() => {
    async function fetchSellers() {
      try {
        const token = getCookie("token");
        const response = await makeRequest({
          url: `${process.env.NEXT_PUBLIC_API_URL}/seller/${id}?page=${currentPage}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept": "application/json",
            'ngrok-skip-browser-warning': 'true'
          },
          isFormData: true,
        });

        setSeller(response.data.seller);
        setAds(response.data.ads);
        updateTotalPages(response.metadata.pagination);

      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    }

    fetchSellers();
  }, [currentPage]);

  if (loading) {
    return <Loader/>;
  }

  return (
    <>
      <SellerProfileSection seller={seller}/>

      <div className={"bg-secondary-background rounded-lg p-6 mt-6"}>
        <h2 className="text-xl font-medium my-8">Ads by seller</h2>
        {
          ads?.length === 0 ? (
            <div className="text-center text-gray-500">
              No Ads found for this seller
            </div>) : <ProductCard sellerAds={ads}/>
        }
        <Pagination pageCount={totalPages}
                    handlePageClick={handlePageClick}
                    currentPage={currentPage}
                    totalItems={totalItems}
        />
      </div>
    </>
  )
}