"use client"
import SellerCard from "@/components/sellers/SellerCard";
import {useApiRequest} from "@/app/hooks/useApiRequest";
import {useEffect, useState} from "react";
import {getCookie} from "@/app/lib/cookies";
import Loader from "@/app/lib/Loader";
import Pagination from "@/components/pagination/Pagination";
import {usePagination} from "@/app/hooks/usePagination";
import useFilter from "@/app/hooks/useFilter";
import Filters from "@/components/filters/Filters";

export default function page() {
  const {makeRequest, loading, error} = useApiRequest();
  const [sellers, setSellers] = useState([]);
  const {currentPage, totalPages, handlePageClick, updateTotalPages, setCurrentPage, totalItems} = usePagination();
  const {
    status,
    setStatus,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    searchQuery,
    setSearchQuery,
    buildQueryParams
  } = useFilter()

  useEffect(() => {
    async function fetchSellers() {
      try {
        const token = getCookie("token");
        const queryParams = buildQueryParams();

        const response = await makeRequest({
          url: `${process.env.NEXT_PUBLIC_API_URL}/sellers?page=${currentPage}&${queryParams}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept": "application/json",
            'ngrok-skip-browser-warning': 'true'
          },
          isFormData: true,
        });

        setSellers(response.data.sellers);
        updateTotalPages(response.metadata.pagination);

      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    }

    fetchSellers();
  }, [currentPage, status, startDate, endDate, searchQuery]);

  return (
    <>
      <div className={"flex justify-between items-center p-6 pb-0 md:p-0 md:pb-6"}>
        <h2 className="text-2xl font-medium">Sellers</h2>
      </div>

      <div className={"bg-secondary-background rounded-md p-6"}>
        <Filters search={true}
                 searchQuery={searchQuery}
                 setSearchQuery={setSearchQuery}
                 setStatus={setStatus}
                 startDate={startDate}
                 endDate={endDate}
                 setEndDate={setEndDate}
                 setStartDate={setStartDate}
                 status={status}
                 setCurrentPage={setCurrentPage}
        />

        {
          loading
            ?
            <Loader/>: error ? (
                <div className={"text-center"}>{error}</div>
              )
            :
            <div className={"grid grid-cols-1 md:grid-cols-4 gap-8 my-8"}>
              {
                sellers?.map((seller, index) => (<SellerCard seller={seller} key={index}/>))
              }
            </div>
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