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
import { useApiRequest } from "@/app/hooks/useApiRequest";
import {useRouter} from "next/navigation";

const AdRepostStatusForm = ({ initialData, setProducts, setSheetOpen }) => {
  const isEditMode = !!initialData;
  const router = useRouter();
  // Initialize useForm with default values
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      status: initialData?.status || "",
    },
  });

  const { makeRequest, loading, error, data } = useApiRequest();

  // Form submission handler
  const onSubmit = async (formData) => {
    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("No token found!");
        return;
      }

      // Create FormData for PATCH request
      const patchData = new FormData();
      patchData.append("status", formData.status);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reports/${initialData.id}?_method=PATCH`,
        {
          method: "POST", // Using POST with _method=PATCH for partial updates
          headers: {
            Authorization: `Bearer ${token}`, // Do NOT set Content-Type when using FormData
            Accept: "application/json",
          },
          body: patchData,
        }
      );

      const res = await response.json();
      if(!res.success) throw new Error(res.message);
      if (res && setProducts) {
        setProducts((prevReport) =>
          isEditMode
            ? prevReport.map((report) => (report.id === res.data.report.id ? res.data.report : report))
            : [res.data.report, ...prevReport]
        );
      }
      toast.success(res.message);
      // Close the sheet after update
      reset();
      if(setSheetOpen) setSheetOpen(false);
    } catch (error) {
      toast.error(error.message || "Error updating Report.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Status (Dropdown) using Controller */}
          <div>
            <Label htmlFor="status">Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field: { onChange, value } }) => (
                <Select value={value} onValueChange={onChange}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="dismissed">Dismissed</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
            )}
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
                router.push("/ad-reports/all");
                if (setSheetOpen) setSheetOpen(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </>
      )}
    </form>
  );
};

export default AdRepostStatusForm;
