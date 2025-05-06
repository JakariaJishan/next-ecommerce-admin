import AdminForm from "@/components/admins/admin-form";

export default function page(){
  return(
    <>
      <div className={"p-6 pb-0 md:p-0 md:pb-6"}>
        <h2 className="text-2xl font-medium">Create Admin</h2>
        <AdminForm/>
      </div>
    </>
  )
}