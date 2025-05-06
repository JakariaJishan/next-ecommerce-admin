"use client";
import {useApiRequest} from "@/app/hooks/useApiRequest";
import Loader from "@/app/lib/Loader";
import {Button} from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {DataTable} from "@/shared/data-table";
import {IoMdAdd} from "react-icons/io";
import {useEffect, useState} from "react";
import {getCookie} from "@/app/lib/cookies";
import RoleForm from "@/components/roles/role-form";
import {columns} from "@/app/roles/all/columns";
import Pagination from "@/components/pagination/Pagination";
import {usePagination} from "@/app/hooks/usePagination";
import useFilter from "@/app/hooks/useFilter";
import Filters from "@/components/filters/Filters";

export default function Page() {
  const {makeRequest, loading, error} = useApiRequest();
  const [roles, setRoles] = useState([]);
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
    async function fetchRoles() {
      try {
        const token = getCookie("token");
        const queryParams = buildQueryParams();

        const response = await makeRequest({
          url: `${process.env.NEXT_PUBLIC_API_URL}/roles?page=${currentPage}&${queryParams}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            'ngrok-skip-browser-warning': 'true'
          },
          isFormData: true,
        });

        // Assuming the API returns the roles under response.data.roles
        setRoles(response.data.roles);
        updateTotalPages(response.metadata.pagination);

      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    }

    fetchRoles();
  }, [currentPage, status, startDate, endDate, searchQuery]);

  return (
    <>
      <div className="flex justify-between items-center p-6 pb-0 md:p-0 md:pb-6">
        <h2 className="text-2xl font-medium">Roles</h2>

        {/* Button to open the sheet for adding a new role */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button className="bg-[#009EF7] text-[#FFFFFF] font-medium flex items-center gap-2">
              <IoMdAdd/>
              Add Role
            </Button>
          </SheetTrigger>
          <SheetContent className="max-h-screen overflow-y-auto md:max-w-[50rem]">
            <SheetHeader>
              <SheetTitle>Add Role</SheetTitle>
            </SheetHeader>
            {/* RoleForm component should handle creating a new role */}
            <RoleForm setProducts={setRoles} setSheetOpen={setSheetOpen}/>
          </SheetContent>
        </Sheet>
      </div>

      {/* DataTable displaying all roles */}
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
            ) : <DataTable columns={columns(roles, setRoles)} data={roles}/>
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
