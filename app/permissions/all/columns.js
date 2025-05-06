"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {CircleCheck} from "lucide-react";
import PermissionForm from "@/components/permissions/permission-form";
import { FormatTime } from "@/app/lib/formatted-time";
import RowActionDropdown from "@/components/actions/row-action-dropdown";
import {FormatString} from "@/app/lib/format-string";

export const columns = (permissions, setPermissions) => [
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
    header: "Permission ID",
    cell: ({ row }) => (
      <span className="font-semibold">#{row.getValue("id")}</span>
    ),
  },
  {
    accessorKey: "resource",
    header: "Resource Name",
    cell: ({ row }) => {
      const permission = row.original;

      return (
        <div className="flex items-center gap-3">
          <span>{FormatString(permission.resource) || "N/A"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "permissions",
    header: "Permissions",
    cell: ({ row }) => {
      const permission = row.original;
      return (
        <div className="flex items-center gap-3">
          <ul className={"flex items-center gap-3"}>
            {permission.action?.map((action, idx) => (
              <li key={idx} className={"flex items-center gap-1"}>
                <CircleCheck size={15} color={"green"}/> {action}
              </li>
            ))}
          </ul>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("description") || "N/A"}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <div className="font-medium">
        {FormatTime(row.getValue("createdAt")) || "N/A"}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RowActionDropdown
      row={row}
      setState={setPermissions}
      url={`permissions`}
      ProductForm={PermissionForm}
      largeSheet={true}
    />,
  },
];
