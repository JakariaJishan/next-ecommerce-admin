"use client";


import { Checkbox } from "@/components/ui/checkbox";
import RoleForm from "@/components/roles/role-form";
import { FormatTime } from "@/app/lib/formatted-time";
import RowActionDropdown from "@/components/actions/row-action-dropdown";
import Link from "next/link";
import {Shield} from "lucide-react";

export const columns = (roles, setRoles) => [
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
    header: "Role ID",
    cell: ({ row }) => (
      <span className="font-semibold">#{row.getValue("id")}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Role Name",
    cell: ({ row }) => {
      const role = row.original;
      return (
        <div className="flex items-center gap-3">
          <span>{role.name || "N/A"}</span>
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
    accessorKey: "permissions",
    header: "Permissions",
    cell: ({ row }) => {
      const role = row.original;
      return <div className="font-medium text-center">
        <Link href={`/roles/${role.id}/permissions`}>
          <Shield/>
        </Link>
      </div>
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => (
      <div className="font-medium">
        {FormatTime(row.getValue("created_at")) || "N/A"}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RowActionDropdown
      row={row}
      setState={setRoles}
      url={`roles`}
      ProductForm={RoleForm}
      largeSheet={true}
    />
  },
];
