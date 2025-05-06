"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {FormatTime} from "@/app/lib/formatted-time";
import RowActionDropdown from "@/components/actions/row-action-dropdown";
import AddStatusUpdateForm from "@/components/product/AddStatusUpdateForm";

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

export const columns = (products, setProducts) => [
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
        header: "Ad ID",
        cell: ({ row }) => <span className="font-semibold">#{row.getValue("id")}</span>,
    },

    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => {
            const ad = row.original;

            return (
                <div className="flex items-center gap-3">
                    {ad.media.length > 0 && (
                        <img
                        src={ad.media[0].original_url}
                        alt={ad.title}
                        className="w-12 h-12 object-cover rounded"
                        />
                )}
                    <span>{ad.title || "N/A"}</span>
                </div>
            );
        },
    },

    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => <div className="font-medium truncate max-w-xl">{row.getValue("description") || "N/A"}</div>,
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => <div className="font-medium">{row.getValue("price") || "N/A"}</div>,
    },
    {
        accessorKey: "currency",
        header: "Currency",
        cell: ({ row }) => <div className="font-medium">{row.getValue("currency") || "N/A"}</div>,
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
        accessorKey: "moderation_status",
        header: "Moderation Status",
        cell: ({ row }) => {
            const status = row.getValue("moderation_status") || "unknown";
            return (
              <div className="flex items-center">
                  <span className={`w-2 h-2 me-2 rounded-full ${getStatusColor(status)}`}></span>
                  <span className="capitalize">{status}</span>
              </div>
            );
        },
    },
    {
        accessorKey: "created_at",
        header: "Created At",
        cell: ({ row }) => <div className="font-medium">{FormatTime(row.getValue("created_at")) || "N/A"}</div>,
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <RowActionDropdown
          row={row}
          setState={setProducts}
          url={`ads`}
          ProductForm={AddStatusUpdateForm}
          navigateUrl={"ads"}
        />,
    },
];
