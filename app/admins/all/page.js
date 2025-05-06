"use client";
import {useApiRequest} from "@/app/hooks/useApiRequest";
import Loader from "@/app/lib/Loader";
import {Button} from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import {DataTable} from "@/shared/data-table";
import {ChevronDown} from "lucide-react";
import {useEffect, useState} from "react";
import {IoMdAdd} from "react-icons/io";
import {columns} from "./columns";
import {getCookie} from "@/app/lib/cookies";
import AdminForm from "@/components/admins/admin-form";
import CategoryForm from "@/components/category/category-form";
import {DatePickerWithRange} from "@/components/ui/DatePickerWithRange";
import Pagination from "@/components/pagination/Pagination";
import {usePagination} from "@/app/hooks/usePagination";
import useFilter from "@/app/hooks/useFilter";
import Filters from "@/components/filters/Filters";

export default function Page() {
  const {makeRequest, loading, error} = useApiRequest();
  const [admins, setAdmins] = useState([]);
  const [sheetOpen, setSheetOpen] = useState(false);
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
    async function fetchAdmins() {
      try {
        const token = getCookie("token");
        const queryParams = buildQueryParams();
        const response = await makeRequest({
          url: `${process.env.NEXT_PUBLIC_API_URL}/admins?page=${currentPage}&${queryParams}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          isFormData: true,
        });

        // Assuming the API returns the admins under response.data.admins
        setAdmins(response.data.users);
        updateTotalPages(response.metadata.pagination);

      } catch (err) {
        console.error("Error fetching admins:", err);
      }
    }

    fetchAdmins();
  }, [currentPage, status, startDate, endDate, searchQuery]);

  return (
    <>
      <div className="flex justify-between items-center p-6 pb-0 md:p-0 md:pb-6 ">
        <h2 className="text-2xl font-medium">Admin List</h2>
        {/* Add Product Button Triggers Sheet */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button className="bg-[#009EF7] text-[#FFFFFF] font-medium flex items-center gap-2">
              <IoMdAdd/>
              Add Admin
            </Button>
          </SheetTrigger>

          {/* Sheet Content */}
          <SheetContent className="max-h-screen overflow-y-auto md:max-w-[50rem]">
            <SheetHeader>
              <SheetTitle>Add Admin</SheetTitle>
            </SheetHeader>
            {/* Add Your Form or Other Content Here */}
            <AdminForm setProducts={setAdmins} setSheetOpen={setSheetOpen}/>
          </SheetContent>
        </Sheet>
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

        <div className="p-6 space-y-6">
          {
            loading ? <Loader/> : error ? (
              <div className={"text-center"}>{error}</div>
            ) : <DataTable columns={columns(admins, setAdmins)} data={admins}/>
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
