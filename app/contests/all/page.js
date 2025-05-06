"use client";
import { useApiRequest } from "@/app/hooks/useApiRequest";
import Loader from "@/app/lib/Loader";
import ContestForm from "@/components/contest/ContestForm";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DataTable } from "@/shared/data-table";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { columns } from "./columns";
import { getCookie } from "@/app/lib/cookies";
import CategoryForm from "@/components/category/category-form";
import {usePagination} from "@/app/hooks/usePagination";
import Pagination from "@/components/pagination/Pagination";
import useFilter from "@/app/hooks/useFilter";
import Filters from "@/components/filters/Filters";

export default function page() {
  const { makeRequest, loading, error } = useApiRequest();
  const [contests, setContests] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All Contests");
  const [sheetOpen, setSheetOpen] = useState(false);
  const {currentPage, totalPages, handlePageClick, updateTotalPages, setCurrentPage, totalItems} = usePagination();
  const {status, setStatus, startDate, setStartDate, endDate, setEndDate, buildQueryParams} = useFilter()

  const statusOptions = [
    {value: "active", label: "Active"},
    {value: "closed", label: "Closed"},
  ];


  useEffect(() => {
    async function fetchContests() {
      try {
        const token = getCookie("token");
        const queryParams = buildQueryParams();
        const response = await makeRequest({
          url: `${process.env.NEXT_PUBLIC_API_URL}/contests?page=${currentPage}&${queryParams}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          isFormData: true,
        });

        setContests(response.data.contests);
        updateTotalPages(response.metadata.pagination);

      } catch (err) {
        console.error("Error fetching contests:", err);
      }
    }

    fetchContests();
  }, [currentPage, status, startDate, endDate]);

  return (
    <>
      <div className="flex justify-between items-center p-6 pb-0 md:p-0 md:pb-6 ">
        <h2 className="text-2xl font-medium">Contest List</h2>
        {/* Add Product Button Triggers Sheet */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button className="bg-[#009EF7] text-[#FFFFFF] font-medium flex items-center gap-2">
              <IoMdAdd />
              Add Contest
            </Button>
          </SheetTrigger>

          {/* Sheet Content */}
          <SheetContent className="max-h-screen overflow-y-auto md:max-w-[50rem]">
            <SheetHeader>
              <SheetTitle>Add Contest</SheetTitle>
            </SheetHeader>
            {/* Add Your Form or Other Content Here */}
            <ContestForm setProducts={setContests} setSheetOpen={setSheetOpen}/>
          </SheetContent>
        </Sheet>
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
            loading ? <Loader/> : error ? (
              <div className={"text-center"}>{error}</div>
            ) : <DataTable columns={columns(contests, setContests)} data={contests} />
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
