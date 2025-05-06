'use client';

import { useApiRequest } from "@/app/hooks/useApiRequest";
import { getCookie } from "@/app/lib/cookies";
import Loader from "@/app/lib/Loader";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {MoreHorizontal, Pencil} from "lucide-react"; // Icon for three dots
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { toast } from "react-hot-toast";
import { IoEyeOutline } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import {FormatTime} from "@/app/lib/formatted-time";
import {Sheet, SheetContent, SheetHeader, SheetOverlay, SheetTitle} from "@/components/ui/sheet";
import {
    AlertDialog, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import AddStatusUpdateForm from "@/components/product/AddStatusUpdateForm";

export default function LatestOrders() {
    const { makeRequest, loading, error, data } = useApiRequest();
    const [ads, setAds] = useState([]);
    const router = useRouter();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [openEditSheet, setOpenEditSheet] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            const token = getCookie("token");

            try {
                const responseData = await makeRequest({
                    url: `${process.env.NEXT_PUBLIC_API_URL}/dashboards/top-sold-ads`,
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'ngrok-skip-browser-warning': 'true',
                    },
                });

                setAds(responseData.data.top_sold_ads);
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchOrders();
    }, []);

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
                url: `${process.env.NEXT_PUBLIC_API_URL}/ads/${id}`,
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.success) {
                setAds((prevProducts) => prevProducts.filter((product) => product.id !== id));
                toast.success("Product deleted successfully!");
            } else {
                throw new Error(response.message || "Failed to delete product.");
            }
        } catch (error) {
            toast.error("Failed to delete product. Please try again.");
        }
    };

    if (loading) {
        return <Loader />; // Show Loader component while loading
    }

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "bg-[#FEA73E]";
            case "active":
                return "bg-blue-500";
            case "sold":
                return "bg-[#22C38F]";
            case "expired":
                return "bg-[#FC424A]";
            default:
                return "bg-gray-500";
        }
    };

// Function to capitalize the first letter of a string
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <div className="p-4">
            <h1 className="text-[20px] font-medium mb-4">Latest Ads</h1>

            <Table>
                <TableHeader>
                    <TableRow className={"text-muted-foreground"}>
                        <TableHead >Ad</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="text-[13px] ">
                    {ads?.map((ad) => (
                        <TableRow key={ad.id}>
                            <TableCell>
                                <ul>
                                    {ad.media.length > 0 && (
                                      <li className="flex items-center gap-2">
                                          <img
                                            src={ad.media[0].original_url || "/no_image.webp"}
                                            alt={ad.title}
                                            className="w-12 h-12 rounded object-cover"
                                          />
                                          <span className={"truncate max-w-xs md:max-w-md"}>
                                              {ad.title}
                                            </span>
                                      </li>
                                    )}

                                </ul>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <div>
                                        <p className={"truncate max-w-xs md:max-w-md"}>{ad.description}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{ad.currency} {ad.price}</TableCell>
                            <TableCell>
                                <div className="flex items-center">
                                    <span
                                      className={`w-2 h-2 me-2 rounded-full ${getStatusColor(ad.status)}`}
                                    ></span>
                                    <span>{capitalizeFirstLetter(ad.status)}</span>
                                </div>
                            </TableCell>
                            <TableCell>{FormatTime(ad.created_at)}</TableCell>



                            {/* Three-dot dropdown menu for actions */}
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="p-2 focus-visible:outline-none">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className={"p-0"}>
                                        {/* View Details */}
                                        <DropdownMenuItem
                                            onClick={() => router.push(`/ads/${ad.id}`)}
                                            className="cursor-pointer mt-2 rounded-none group flex items-center gap-2 px-3 py-2 transition-colors hover:!bg-hover-background hover:text-info-text"
                                          >
                                              <IoEyeOutline className="w-5 h-5 text-info-gray transition-colors group-hover:text-info-text" />
                                              <p className="transition-colors text-info-gray group-hover:text-info-text">View Details</p>
                                          </DropdownMenuItem>

                                        <DropdownMenuItem
                                          onClick={() => {
                                              setSelectedProduct(ad);
                                              setOpenEditSheet(true);
                                          }}
                                          className="cursor-pointer mt-2 rounded-none group flex items-center gap-2 px-3 py-2 transition-colors hover:!bg-hover-background hover:text-info-text"
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
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Sheet open={openEditSheet} onOpenChange={setOpenEditSheet}>
                <SheetContent className={`max-h-screen overflow-y-auto md:max-w-[50rem]`}>
                    <SheetHeader>
                        <SheetTitle>Edit</SheetTitle>
                    </SheetHeader>
                    {/* Load ProductEditForm only if a product is selected */}
                    {selectedProduct && <AddStatusUpdateForm initialData={selectedProduct} setProducts={setAds} selectedProduct={selectedProduct} setSheetOpen={setOpenEditSheet}/>}
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
                              handleProductDelete(selectedProduct.id);
                              setOpenDeleteDialog(false); // Close dialog after deletion
                          }}
                        >
                            Confirm Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
