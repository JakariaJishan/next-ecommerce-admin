
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {MoreHorizontal, Pencil} from "lucide-react";
import { useRouter } from "next/navigation";
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";

import { useApiRequest } from "@/app/hooks/useApiRequest";
import { getCookie } from "@/app/lib/cookies";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { useState } from "react";
import { toast } from "react-hot-toast";
import AddStatusUpdateForm from "@/components/product/AddStatusUpdateForm";

export default function RowActionDropdown({row, setState, url, navigateUrl = null, ProductForm, largeSheet = false, fromRole=false}) {
  const { makeRequest, loading, error, data } = useApiRequest();
  const product = row.original;
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openEditSheet, setOpenEditSheet] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const handleProductDelete = async (id) => {
    if (!id) {
      toast.error("No product ID provided!");
      return;
    }

    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("No token found!");
        return;
      }

      const response = await makeRequest({
        url: `${process.env.NEXT_PUBLIC_API_URL}/${url}/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.success) {
        setState((prevProducts) => prevProducts.filter((product) => product.id !== id));
        toast.success("Product deleted successfully!");
      } else {
        throw new Error(response.message || "Failed to delete product.");
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete product. Please try again.");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-2 focus-visible:outline-none">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className={"p-0"}>
          {/* View Details */}
          {navigateUrl && (<DropdownMenuItem
              onClick={() => router.push(`/${navigateUrl}/${product.id}`)}
              className="cursor-pointer mt-2 rounded-none group flex items-center gap-2 px-3 py-2 transition-colors hover:!bg-hover-background hover:text-info-text"
            >
              <IoEyeOutline className="w-5 h-5 text-info-gray transition-colors group-hover:text-info-text" />
              <p className="transition-colors text-info-gray group-hover:text-info-text">View Details</p>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={() => {
              setSelectedProduct(product);
              setOpenEditSheet(true);
            }}
            className="cursor-pointer rounded-none group flex items-center gap-2 px-3 py-2 transition-colors hover:!bg-hover-background hover:text-info-text"
          >
            <Pencil className="w-5 h-5 text-info-gray transition-colors group-hover:text-info-text" />
            <p className="transition-colors text-info-gray group-hover:text-info-text">
              Edit Info
            </p>
          </DropdownMenuItem>

          {/* Delete */}
          <DropdownMenuItem
            onClick={() => setOpenDeleteDialog(true)}
            className="cursor-pointer mb-2 rounded-none group flex items-center gap-2 px-3 py-2 transition-colors hover:!bg-hover-background hover:text-info-text"
          >
            <RiDeleteBinLine className="w-5 h-5 text-info-gray transition-colors group-hover:text-info-text" />
            <p className="transition-colors text-info-gray group-hover:text-info-text">
              Delete
            </p>
          </DropdownMenuItem>

          {/* ShadCN AlertDialog */}
        </DropdownMenuContent>
      </DropdownMenu>
      <Sheet open={openEditSheet} onOpenChange={setOpenEditSheet}>
        <SheetContent className={`max-h-screen overflow-y-auto ${largeSheet ?"md:max-w-[50rem]": ""} `}>
          <SheetHeader>
            <SheetTitle>Edit</SheetTitle>
          </SheetHeader>
          {/* Load ProductEditForm only if a product is selected */}
          {selectedProduct && <ProductForm initialData={selectedProduct} setProducts={setState} selectedProduct={selectedProduct} setSheetOpen={setOpenEditSheet} fromRole={fromRole}/>}
        </SheetContent>
      </Sheet>
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenDeleteDialog(false)}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive" // ShadCN Destructive Button
              onClick={() => {
                handleProductDelete(product.id);
                setOpenDeleteDialog(false); // Close dialog after deletion
              }}
            >
              Confirm Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>

  );
}