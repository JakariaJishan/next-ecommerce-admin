import PermissionForm from "@/components/permissions/permission-form";

export default function page() {
  return (
    <>
      <div className={"p-6 pb-0 md:p-0 md:pb-6"}>
        <h2 className={"text-2xl font-medium"}>Create Permission</h2>
        <PermissionForm/>
      </div>
    </>
  )
}