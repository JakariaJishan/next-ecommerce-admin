import ProductEditForm from "@/components/product/ProductEditForm";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { SlOptions } from "react-icons/sl";

const GridView = ({ products }) => {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openEditSheet, setOpenEditSheet] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  return (
    <div className="grid grid-cols-4 gap-8 mt-2">
      {products.map((product) => (
        <div key={product.id} className="border p-4 rounded-lg bg-background">
          {/* ✅ Product Image */}
          <img
            src={product.image_urls?.[0] || "/default-image.jpg"}
            alt={product.title}
            className="w-full h-60 object-cover rounded-md"
          />

          {/* ✅ Title + Options Icon Row */}
          <div className="flex justify-between items-center mt-2">
            <div>
              <h3 className="text-[#949CA9]">{product.title}</h3>
              <p>
                {product.currency} {product.price}
              </p>
            </div>

            {/* ✅ Three-dot Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-md hover:bg-gray-100">
                  <SlOptions className="text-[#949CA9] cursor-pointer" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* View Details */}
                <DropdownMenuItem
                  onClick={() => router.push(`/order/${product.id}`)}
                  className="group flex items-center gap-2 px-3 py-2 transition-colors hover:!bg-[#E9F2FA] hover:text-[#009EF7]"
                >
                  <IoEyeOutline className="w-5 h-5 text-[#949CA9] transition-colors group-hover:text-[#009EF7]" />
                  <p className="transition-colors text-[#949CA9] group-hover:text-[#009EF7]">
                    View Details
                  </p>
                </DropdownMenuItem>

                {/* Edit Info */}
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedProduct(product.id);
                    setOpenEditSheet(true);
                  }}
                  className="group flex items-center gap-2 px-3 py-2 transition-colors hover:!bg-[#E9F2FA] hover:text-[#009EF7]"
                >
                  <MdModeEdit className="w-5 h-5 text-[#949CA9] transition-colors group-hover:text-[#009EF7]" />
                  <p className="transition-colors text-[#949CA9] group-hover:text-[#009EF7]">
                    Edit Info
                  </p>
                </DropdownMenuItem>

                {/* Delete */}
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedProduct(product.id);
                    setOpenDeleteDialog(true);
                  }}
                  className="group flex items-center gap-2 px-3 py-2 transition-colors hover:!bg-[#E9F2FA] hover:text-[#009EF7]"
                >
                  <RiDeleteBinLine className="w-5 h-5 text-[#949CA9] transition-colors group-hover:text-[#009EF7]" />
                  <p className="transition-colors text-[#949CA9] group-hover:text-[#009EF7]">
                    Delete
                  </p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
      {/* ✅ Edit Product Sheet */}
      <Sheet open={openEditSheet} onOpenChange={setOpenEditSheet}>
        <SheetContent className="max-h-screen overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Product</SheetTitle>
            <SheetDescription>Edit product details below.</SheetDescription>
          </SheetHeader>
          {selectedProduct && (
            <ProductEditForm
              productId={selectedProduct}
              onClose={() => setOpenEditSheet(false)}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* ✅ Delete Confirmation Dialog */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenDeleteDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => {
                handleProductDelete(selectedProduct);
                setOpenDeleteDialog(false);
              }}
            >
              Confirm Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GridView;
