"use client";
import {useApiRequest} from "@/app/hooks/useApiRequest";
import {getCookie} from "@/app/lib/cookies";
import Loader from "@/app/lib/Loader";
import {DataTable} from "@/shared/data-table";
import {useEffect, useState} from "react";
import {columns} from "./columns";
import {usePagination} from "@/app/hooks/usePagination";
import Pagination from "@/components/pagination/Pagination";
import Filters from "@/components/filters/Filters";
import useFilter from "@/app/hooks/useFilter";

export default function page() {
  const {makeRequest, loading, error} = useApiRequest();
  const [products, setProducts] = useState([]); // Store full response data
  const {currentPage, totalPages, handlePageClick, updateTotalPages, setCurrentPage, totalItems} = usePagination();
  const {status, setStatus, startDate, setStartDate, endDate, setEndDate, buildQueryParams} = useFilter()

  const statusOptions = [
    {value: "pending", label: "Pending"},
    {value: "active", label: "Active"},
    {value: "sold", label: "Sold"},
    {value: "expired", label: "Expired"}
  ];

  useEffect(() => {
    async function fetchProducts() {
      try {
        const token = getCookie("token");
        const queryParams = buildQueryParams();
        const response = await makeRequest({
          url: `${process.env.NEXT_PUBLIC_API_URL}/ads?page=${currentPage}&${queryParams}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept": "application/json",
            'ngrok-skip-browser-warning': 'true'
          },
          isFormData: true,
        });

        setProducts(response.data.ads);
        updateTotalPages(response.metadata.pagination);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    }

    fetchProducts();
  }, [currentPage, status, startDate, endDate]);

  return (
    <>
      <div className="flex justify-between items-center p-6 pb-0 md:p-0 md:pb-6">
        <h2 className="text-2xl font-medium">Ad List</h2>
      </div>

      <div className={"bg-secondary-background rounded-md p-6"}>
        <Filters statusOptions={statusOptions}
                 setStatus={setStatus}
                 startDate={startDate}
                 endDate={endDate}
                 setEndDate={setEndDate}
                 setStartDate={setStartDate}
                 status={status}
                 setCurrentPage={setCurrentPage}
        />

          <div className="p-6 space-y-6">
            {
              loading ? <Loader/>
                : error ? (
                  <div className={"text-center"}>{error}</div>
                ) : <DataTable columns={columns(products, setProducts)} data={products}/>
            }
            <Pagination pageCount={totalPages}
                        handlePageClick={handlePageClick}
                        currentPage={currentPage}
                        totalItems={totalItems}
            />
          </div>
      </div>
    </>
);
}
