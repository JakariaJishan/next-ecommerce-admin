import { useForm, Controller } from "react-hook-form";
import { getCookie } from "@/app/lib/cookies";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import {useRouter} from "next/navigation";

const AddStatusUpdateForm = ({ initialData, setProducts, setSheetOpen }) => {
  const isEditMode = !!initialData;
  const router = useRouter();
  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      status: initialData?.status || "",
      moderation_status: initialData?.moderation_status || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("No token found!");
        return;
      }

      // Create FormData for PATCH request
      const formData = new FormData();
      formData.append("status", data.status);
      formData.append("moderation_status", data.moderation_status);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ads/${initialData.id}?_method=PATCH`,
        {
          method: "POST", // Using POST with _method=PATCH for partial updates
          headers: {
            Authorization: `Bearer ${token}`, // Do NOT set Content-Type when using FormData
            Accept: "application/json",
          },
          body: formData,
        }
      );

      const res = await response.json();
      if(!res.success) throw new Error(res.message);
      if (res && setProducts) {
        setProducts((prevReport) =>
          isEditMode
            ? prevReport.map((report) => (report.id === res.data.ad.id ? res.data.ad : report))
            : [res.data.ad, ...prevReport]
        );
      }
      toast.success("Report updated successfully!");
      // Close the sheet after update
      reset();
      if(setSheetOpen) setSheetOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Status (Dropdown) */}
      <div>
        <Label htmlFor="status">Status</Label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select {...field}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Moderation Status (Dropdown) */}
      <div>
        <Label htmlFor="moderation_status">Moderation Status</Label>
        <Controller
          name="moderation_status"
          control={control}
          render={({ field }) => (
            <Select {...field}>
              <SelectTrigger id="moderation_status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary dark:bg-[#009EF7] text-white"
        >
          {isSubmitting
            ? "Saving..."
            : "Save Changes"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => {
            router.push("/ads/all");
            if (setSheetOpen) setSheetOpen(false);
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AddStatusUpdateForm;
