"use client";

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
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {MoreHorizontal, Pencil} from "lucide-react";
import { useRouter } from "next/navigation";
import { IoEyeOutline } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";

import { useApiRequest } from "@/app/hooks/useApiRequest";
import { getCookie } from "@/app/lib/cookies";
import ProductEditForm from "@/components/product/ProductEditForm";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { useState } from "react";
import { toast } from "react-hot-toast";
import AddStatusUpdateForm from "@/components/product/AddStatusUpdateForm";
import BlogForm from "@/components/blog/BlogForm";
import {FormatTime} from "@/app/lib/formatted-time";
import CategoryForm from "@/components/category/category-form";
import RowActionDropdown from "@/components/actions/row-action-dropdown";

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "draft":
      return "bg-[#FEA73E]";
    case "archived":
      return "bg-blue-500";
    case "published":
      return "bg-purple-500";
    case "sold":
      return "bg-[#22C38F]";
    case "cancelled":
      return "bg-[#FC424A]";
    default:
      return "bg-gray-500";
  }
};

export const columns = (blogs, setBlogs) => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "Blog ID",
    cell: ({ row }) => <span className="font-semibold">#{row.getValue("id")}</span>,
  },

  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <span>{row.getValue("title") || "N/A"}</span>
  },

  {
    accessorKey: "published_date",
    header: "Published Date",
    cell: ({ row }) => <div className="font-medium">{FormatTime(row.getValue("published_date")) || "N/A"}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") || "unknown";
      return (
        <div className="flex items-center">
          <span className={`w-2 h-2 me-2 rounded-full ${getStatusColor(status)}`}></span>
          <span className="capitalize">{status}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RowActionDropdown
      row={row}
      setState={setBlogs}
      url={`blog-posts`}
      navigateUrl={'blogs'}
      ProductForm={BlogForm}
      largeSheet={true}
    />,
  },
];
