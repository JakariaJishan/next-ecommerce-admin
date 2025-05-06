import {useApiRequest} from "@/app/hooks/useApiRequest";
import useVendorNotifications from "@/app/hooks/useVendorNotifications";
import {getCookie} from "@/app/lib/cookies";
import {ThemeModeToggle} from "@/components/theme/theme-mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import {CiSearch} from "react-icons/ci";
import {FaCircleArrowRight} from "react-icons/fa6";
import {GoBell} from "react-icons/go";
import {
  MdAdd,
  MdEmail,
  MdGroup,
  MdKeyboard,
  MdLogout,
  MdMessage,
  MdMoreHoriz,
  MdPayment,
  MdPerson,
  MdPersonAdd,
  MdSettings,
  MdSupportAgent
} from "react-icons/md";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {ChevronDown, Menu} from "lucide-react";
import Notification from "@/components/notification/Notification";

export default function Navbar({setMobileSidebarOpen, mobileSidebarOpen}) {
  const {makeRequest, loading, error} = useApiRequest();
  const [admin, setAdmin] = useState(null)
  const router = useRouter();
  const [selectedFlag, setSelectedFlag] = useState({
    src: "https://flagcdn.com/w40/bd.png", // Default BD flag
    alt: "Bangladesh",
  });
  const [notifications, setNotifications] = useState([]);
  const baseApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/notifications/`;
  const pushMessage = useVendorNotifications();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = getCookie("token");
        const data = await makeRequest({
          url: baseApiUrl,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setNotifications(data.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, [baseApiUrl]);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = getCookie("token");
        const data = await makeRequest({
          url: `${process.env.NEXT_PUBLIC_API_URL}/current-user-info/`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        });

        setAdmin(data.data.user);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchAdmin();
  }, [])
  // Append new real-time notifications
  // useEffect(() => {
  //   if (pushMessage) {
  //     const updatedNotification = {...pushMessage, is_read: false}; // Ensure is_read is false for real-time
  //     setNotifications((prev) => [updatedNotification, ...prev]);
  //     toast.success(pushMessage.message);
  //   }
  // }, [pushMessage]);
  // // Filter unread notifications dynamically
  // const unreadNotificationsCount = notifications.filter(
  //   (n) => !n.is_read
  // ).length;

  const handleLogOut = () => {
    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure";
    router.push("/auth/signin");
    toast.success("Logout successful");
  };

  const handleClose = (e) => {
    e.stopPropagation();
  };
  const firstLetters = admin?.username?.split(" ").map(word=> word[0]).join("").toUpperCase();

  return (
    <nav className="bg-background border-b border-border drop-shadow-sm h-[80px] flex items-center px-6">
      <button
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        className="text-gray-700 focus:outline-none md:hidden mr-2"
      >
        <Menu size={24} />
      </button>
      <div className="flex justify-between w-full">
        {/* Left-side navbar content */}
        <div className="flex items-center">
          <div className="relative">
            {/* Search Icon */}
            <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg"/>

            {/* Input Field */}
            <input
              type="text"
              placeholder="Search Order, Products etc..."
              className="pl-10 rounded-md px-3 py-2 text-sm w-36 md:w-64 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-6">
          {/* Notification Bell */}
          <Notification/>
          {/* Right-side navbar content */}
          <ThemeModeToggle/>
          {/*Profile*/}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 md:gap-4 cursor-pointer">
                {/* Avatar */}
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

                <ChevronDown className={"block md:hidden"}/>
                {/* User Information */}
                <p className="text-sm hidden md:block">
                  <strong className="block font-medium">{admin?.username}</strong>
                  <span className={"text-[#949CA9]"}>{admin?.role || "Admin"}</span>
                </p>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <p className="text-sm px-2 block md:hidden">
                <strong className="block font-medium">{admin?.username}</strong>
                <span className={"text-[#949CA9]"}>{admin?.role || "Admin"}</span>
              </p>
              <DropdownMenuSeparator/>
              <DropdownMenuGroup>
                <Link href={"/account"}>
                  <DropdownMenuItem className="cursor-pointer">
                  <span className="flex items-center gap-2">
                    <MdSettings className="text-lg"/> {/* Settings Icon */}
                    Account
                  </span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator/>
              <DropdownMenuItem
                onClick={handleLogOut}
                className="cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <MdLogout className="text-lg"/> {/* Log Out Icon */}
                  Log out
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
