"use client"
import {useEffect, useRef, useState} from "react";
import {getCookie} from "@/app/lib/cookies";
import {toast} from "react-hot-toast";
import {Button} from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useApiRequest} from "@/app/hooks/useApiRequest";
import Loader from "@/app/lib/Loader";
import {Camera, Loader2} from "lucide-react";
import PasswordUpdateForm from "@/components/settings/password-setting";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import {IoMdAdd} from "react-icons/io";

export default function page() {
  const {makeRequest, loading, error} = useApiRequest();
  const [admin, setAdmin] = useState({})
  const token = getCookie("token");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const data = await makeRequest({
          url: `${process.env.NEXT_PUBLIC_API_URL}/current-user-info/`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        });

        setAdmin(data.data.user);
        setPreview(data.data.user.media[0]?.original_url);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchAdmin();
  }, [])

  // ✅ Handle File Upload
  const handleImageUpload = async () => {
    if (!selectedFile) return toast.error("No file selected!");
    setUploading(true);
    const formData = new FormData();
    formData.append("avatar", selectedFile);
    formData.append("current_password", "111111");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/update-user-info?_method=PATCH`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to upload image");

      toast.success("Profile picture updated successfully!");
      setIsModalOpen(false); // Close modal after success
    } catch (err) {
      console.error("Error uploading image", err);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Handle File Selection & Preview
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl); // Show preview
      setSelectedFile(file);
      setIsModalOpen(true);
    }
  };

  // ✅ Trigger File Input Click
  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  if (loading) return <Loader/>

  return (
    <div>
      <div className="flex justify-between items-center p-6 pb-0 md:p-0 md:pb-6 ">
        <h2 className="text-2xl font-medium">Account</h2>
      </div>
      <div className={"flex gap-8 flex-col md:flex-row mt-12"}>
        <div className={"w-full md:w-[30%] flex justify-center bg-card p-8 rounded-lg h-fit"}>
          <div>
            <div className="relative h-32 w-32">
              {/* Avatar Display */}
              <Avatar className="h-full w-full">
                <AvatarImage src={preview} alt="Admin Avatar" className="object-cover"/>
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>

              {/* Hidden File Input */}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              {/* Camera Icon - Triggers File Selection */}
              <div
                className="absolute bottom-0.5 right-0.5 bg-background p-2 rounded-full cursor-pointer border"
                onClick={handleIconClick}
              >
                <Camera className="h-6 w-6"/>
              </div>
            </div>
            {/* ✅ Modal for Image Submission */}
            <Dialog open={isModalOpen} onOpenChange={(open) => {
              setIsModalOpen(open);
              if (!open) {
                setSelectedFile(null)
                setPreview(admin.media[0].original_url)
              }
            }}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Profile Picture</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center">
                  <Avatar className="h-full w-full">
                    <AvatarImage src={preview} alt="Admin Avatar" className="object-cover"/>
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </div>
                <DialogFooter className="flex justify-center gap-4 flex-col">
                  <Button onClick={handleImageUpload} disabled={uploading} className={"flex justify-center bg-primary dark:bg-[#009EF7] text-white"}>
                    {uploading ? <Loader2 className="animate-spin mr-2" size={18}/> : "Upload"}
                  </Button>
                  <Button onClick={() => {
                    setIsModalOpen(false)
                    setSelectedFile(null)
                    setPreview(admin.media[0].original_url)
                  }} variant={"outline"}>
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <div className={"text-center mt-4"}>
              <h2 className={"text-xl font-medium"}>{admin.username}</h2>
              <p className={"text-[#949CA9]"}>{admin.role || "Admin"}</p>
            </div>
          </div>
        </div>
        <div className={"w-full md:w-[70%]"}>
          <Tabs defaultValue="account" className="bg-card rounded-xl p-6">
            <TabsList className="grid w-full gap-8 grid-cols-2 md:grid-cols-4 bg-transparent">
              <TabsTrigger value="account"
                           className={"data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:border-b border-primary rounded-none data-[state=active]:text-primary font-semibold"}>Account</TabsTrigger>
              <TabsTrigger value="password"
                           className={"data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:border-b border-primary rounded-none data-[state=active]:text-primary font-semibold"}>Password</TabsTrigger>

            </TabsList>
            <TabsContent value="account" className={"max-w-2xl"}>
              <Card className={"border-none shadow-none"}>
                <CardContent className="space-y-2 px-0 pt-6">

                  <div className="space-y-1">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" defaultValue={admin.username} disabled
                           className={"h-12 focus-visible:ring-primary focus-visible:ring-2"}/>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue={admin.email} disabled
                           className={"h-12 focus-visible:ring-primary focus-visible:ring-2"}/>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue={admin.phone} disabled
                           className={"h-12 focus-visible:ring-primary focus-visible:ring-2"}/>
                  </div>
                </CardContent>
                <CardFooter className={"px-0"}>
                  <Button disabled className={"bg-primary disabled:bg-accent text-white"}>Save changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            {/*password section*/}
            <PasswordUpdateForm/>
          </Tabs>
        </div>
      </div>
    </div>
  );
}