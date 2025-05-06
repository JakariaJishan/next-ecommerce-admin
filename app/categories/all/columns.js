"use client";

import { Checkbox } from "@/components/ui/checkbox";
import CategoryForm from "@/components/category/category-form";
import RowActionDropdown from "@/components/actions/row-action-dropdown";
import {FormatTime} from "@/app/lib/formatted-time";

export const columns = (categories, setCategories) => [
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
    header: "Category ID",
    cell: ({ row }) => (
      <span className="font-semibold">#{row.getValue("id")}</span>
    ),
  },

  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="flex items-center gap-3">
          <span>{category.name || "N/A"}</span>
        </div>
      );
    },
  },

  {
    accessorKey: "parent_name",
    header: "Parent Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("parent_name") || "N/A"}</div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="font-medium truncate max-w-xl">{row.getValue("description") || "N/A"}</div>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => (
      <div className="font-medium truncate max-w-xl">{FormatTime(row.getValue("created_at")) || "N/A"}</div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RowActionDropdown
      row={row}
      setState={setCategories}
      url={`categories`}
      ProductForm={CategoryForm}
    />,
  },
];
