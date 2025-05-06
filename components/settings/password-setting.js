"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import {TabsContent} from "@/components/ui/tabs";
import {passwordSchema} from "@/schemas/password-schema";
import {getCookie} from "@/app/lib/cookies"; // Import eye icons

export default function PasswordUpdateForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  // ✅ State for toggling password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ✅ Handle Form Submission
  const onSubmit = async (data) => {
    try {
      const token = getCookie("token");
      const formData = new FormData();
      formData.append("current_password", data.current_password);
      formData.append("new_password", data.new_password);
      formData.append("new_password_confirmation", data.confirm_password);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/update-password`,
        {
          method: "POST", // ✅ Use PATCH instead of PUT for partial updates
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Do NOT set Content-Type when using FormData
          },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to update password");
      toast.success("Password updated successfully!");
      reset();
    } catch (error) {
      toast.error("Error updating password");
    }
  };

  return (
    <TabsContent value="password" className={"max-w-2xl"}>
      <Card className="border-none shadow-none">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 px-0 pt-6">

            {/* Current Password */}
            <div className="space-y-1 relative">
              <Label htmlFor="current_password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current_password"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter your current password"
                  className="h-12 pr-10 focus-visible:ring-primary focus-visible:ring-2"
                  {...register("current_password")}
                />
                {/* Eye Toggle Button */}
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.current_password && (
                <p className="text-red-500 text-sm">{errors.current_password.message}</p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-1 relative">
              <Label htmlFor="new_password">New Password</Label>
              <div className="relative">
                <Input
                  id="new_password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter a new password"
                  className="h-12 pr-10 focus-visible:ring-primary focus-visible:ring-2"
                  {...register("new_password")}
                />
                {/* Eye Toggle Button */}
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.new_password && (
                <p className="text-red-500 text-sm">{errors.new_password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1 relative">
              <Label htmlFor="confirm_password">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  className="h-12 pr-10 focus-visible:ring-primary focus-visible:ring-2"
                  {...register("confirm_password")}
                />
                {/* Eye Toggle Button */}
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-red-500 text-sm">{errors.confirm_password.message}</p>
              )}
            </div>

          </CardContent>

          <CardFooter className="px-0">
            <Button type="submit" disabled={isSubmitting} className="bg-primary dark:bg-[#009EF7] text-white">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </TabsContent>
  );
}
