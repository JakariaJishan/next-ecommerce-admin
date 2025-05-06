"use client"
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {GoBell} from "react-icons/go";
import {FaCircleArrowRight} from "react-icons/fa6";
import useEcho from "@/app/hooks/useNotification";
import {useEffect, useMemo, useState} from "react";
import {getCookie} from "@/app/lib/cookies";
import {FormatTime} from "@/app/lib/formatted-time";
import {useApiRequest} from "@/app/hooks/useApiRequest";
import Loader from "@/app/lib/Loader";

export default function Notification() {
  const {data} = useEcho()
  const {makeRequest, loading, error} = useApiRequest();
  const ntf = useMemo(() => (data ? JSON.parse(data) : null), [data]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const token = getCookie("token");

        const response = await makeRequest({
          url: `${process.env.NEXT_PUBLIC_API_URL}/notifications`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          isFormData: true,
        });

        setNotifications(response.data.notifications);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    }

    fetchNotifications();
  }, []);

  useEffect(() => {
    if (ntf && ntf.id) {
      setNotifications((prev) => [ntf, ...prev]);
    }
  }, [ntf]);

  return (
    <div className="relative cursor-pointer">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="relative cursor-pointer">
            <GoBell size={20}/>
            {/*{unreadNotificationsCount > 0 && (*/}
            {/*  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">*/}
            {/*                    {unreadNotificationsCount}*/}
            {/*                </span>*/}
            {/*)}*/}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 shadow-lg rounded-lg p-2 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center">
              <DropdownMenuLabel className="text-[16px]  font-medium">
                Notifications
              </DropdownMenuLabel>
              <button className="text-[12px] text-[#009EF7] font-normal hover:underline">Clear All</button>
            </div>
            <DropdownMenuSeparator className="my-2 "/>
            <DropdownMenuGroup>
              {loading ? <Loader/> : notifications.length > 0 ? notifications.map((item, index) => (
                <div key={item.id}>
                  <DropdownMenuItem
                    className={`flex items-start gap-2 cursor-pointer ${item.status === 'unread' ? "font-semibold" : ""}`}>
                    <div>
                      <p className="">{item.content}</p>
                      <p className="text-xs text-gray-400">
                        {item.created_at ? FormatTime(item.created_at) : "Unknown time"}
                      </p>
                    </div>
                  </DropdownMenuItem>
                  {index < notifications.length - 1 && (
                    <DropdownMenuSeparator className=""/>
                  )}
                </div>
              )) : (
                <p className="text-sm text-gray-400 text-center">No notifications found</p>)}
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-2 "/>
            <DropdownMenuItem className="flex justify-center text-sm cursor-pointer">
              <FaCircleArrowRight/>View More...
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}