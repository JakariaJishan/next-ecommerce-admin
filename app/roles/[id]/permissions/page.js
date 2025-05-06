"use client";
import { useApiRequest } from "@/app/hooks/useApiRequest";
import Loader from "@/app/lib/Loader";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DataTable } from "@/shared/data-table";
import { IoMdAdd } from "react-icons/io";
import { useEffect, useState } from "react";
import { getCookie } from "@/app/lib/cookies";
import PermissionForm from "@/components/permissions/permission-form";
import {columns} from "@/app/roles/[id]/permissions/columns";
import {useParams} from "next/navigation";
import {usePagination} from "@/app/hooks/usePagination";

export default function Page() {
  const {id} = useParams();
  const { makeRequest, loading, error } = useApiRequest();
  const [permissions, setPermissions] = useState([]);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    async function fetchPermissions() {
      try {
        const token = getCookie("token");
        const response = await makeRequest({
          url: `${process.env.NEXT_PUBLIC_API_URL}/roles/${id}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            'ngrok-skip-browser-warning': 'true'
          },
          isFormData: true,
        });

        // Assuming the API returns the permissions under response.data.permissions
        setPermissions(response.data.role.permissions);
      } catch (err) {
        console.error("Error fetching permissions:", err);
      }
    }

    fetchPermissions();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center p-6 pb-0 md:p-0 md:pb-6">
        <h2 className="text-2xl font-medium">Permissions</h2>

        {/* Button to open the sheet for adding a new permission */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button className="bg-[#009EF7] text-[#FFFFFF] font-medium flex items-center gap-2">
              <IoMdAdd />
              Add Permission
            </Button>
          </SheetTrigger>
          <SheetContent className="max-h-screen overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Add Permission</SheetTitle>
            </SheetHeader>
            {/* PermissionForm component should handle creating a new permission */}
            <PermissionForm setProducts={setPermissions} setSheetOpen={setSheetOpen} fromRole={true}/>
          </SheetContent>
        </Sheet>
      </div>

      {/* DataTable displaying all permissions */}
      <div className="p-6 space-y-6">
        {
          loading ? <Loader/> : <DataTable columns={columns(permissions, setPermissions)} data={permissions} />
        }
      </div>
    </>
  );
}
