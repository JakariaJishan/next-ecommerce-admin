"use client";

import { Checkbox } from "@/components/ui/checkbox";
import ContestForm from "@/components/contest/ContestForm";
import {FormatTime} from "@/app/lib/formatted-time";
import RowActionDropdown from "@/components/actions/row-action-dropdown";

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "draft":
      return "bg-[#FEA73E]";
    case "active":
      return "bg-green-500";
    case "published":
      return "bg-purple-500";
    case "sold":
      return "bg-[#22C38F]";
    case "closed":
      return "bg-[#FC424A]";
    default:
      return "bg-gray-500";
  }
};

export const columns = (contests, setContests) => [
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
    accessorKey: "start_date",
    header: "Start Date",
    cell: ({ row }) => <div className="font-medium">{FormatTime(row.getValue("start_date")) || "N/A"}</div>,
  },{
    accessorKey: "end_date",
    header: "End Date",
    cell: ({ row }) => <div className="font-medium">{FormatTime(row.getValue("end_date"))|| "N/A"}</div>,
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
      setState={setContests}
      url={`contests`}
      ProductForm={ContestForm}
      navigateUrl={"contests"}
      largeSheet={true}
    />,
  },
];
