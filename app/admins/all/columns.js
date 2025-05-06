"use client";

import { Checkbox } from "@/components/ui/checkbox";
import AdminForm from "@/components/admins/admin-form";
import {FormatTime} from "@/app/lib/formatted-time";
import RowActionDropdown from "@/components/actions/row-action-dropdown";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export const columns = (admins, setAdmins) => [
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
    header: "Admin ID",
    cell: ({ row }) => (
      <span className="font-semibold">#{row.getValue("id")}</span>
    ),
  },
  {
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({ row }) => {
      const admin = row.original;
      const firstLetters = admin.username?.split(" ").map((n) => n[0]).join("");
      return (
        <>
          {admin?.media.length > 0 ? (
            <Avatar>
              <AvatarImage src={admin?.media[0].original_url}
                           alt="Admin Avatar"
                           className={"object-cover"}
              />
              <AvatarFallback>{firstLetters}</AvatarFallback>
            </Avatar>
          ) : (
            <Avatar>
              <AvatarImage src={"/default-avatar.png"}
                           alt="Admin Avatar" sizes={10}/>
              <AvatarFallback>{firstLetters}</AvatarFallback>
            </Avatar>
          )}
        </>
      );
    }
  },
  {
    accessorKey: "username",
    header: "Name",
    cell: ({ row }) => {
      const admin = row.original;
      return (
        <div className="flex items-center gap-3">
          <span>{admin.username || "N/A"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="font-medium truncate max-w-xl">
        {row.getValue("email") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const admin = row.original;
      return (
        <div className="flex items-center gap-3">
          <span>{admin.phone || "N/A"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "roles",
    header: "Role",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("roles")[0].name || "N/A"}</div>
    ),
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
      setState={setAdmins}
      url={`admins`}
      ProductForm={AdminForm}
    />,
  }

];
