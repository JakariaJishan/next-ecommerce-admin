"use client";
import "@/app/globals.css";
import { getCookie } from "@/app/lib/cookies";
import Navbar from "@/components/sidepanel/Navbar";
import {
  ChartBarStacked,
  LayoutGrid,
  ShoppingBag,
  ShoppingCart,
  Store,
  Library,
  Trophy,
  Cog,
  Users,
  UserCog,
  Flag
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SidebarItem from "./SidebarItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { useState } from "react";

export default function SidePanel({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Define paths that should not use the layout
  const noLayoutPaths = ["/auth/signin"];
  const rolesFromCookie = JSON.parse(getCookie("roles"));

  // Check if the current path matches a no-layout path
  const isNoLayout = noLayoutPaths.includes(pathname);
  if (isNoLayout) {
    return <>{children}</>;
  }

  const handleLogOut = () => {
    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure";
    document.cookie =
      "roles=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure";
    router.push("/auth/signin");
    toast.success("Logout successful");
  };

  const isActive = (href) => pathname === href;

  const sidebarContent = (
    <ScrollArea className="flex h-full w-full flex-col justify-between bg-[#1E1E2D]">
      <div>
        <div className="flex justify-center bg-[#14121F] mb-1">
          <Image
            src="/logo/logo1.png"
            alt="Logo"
            width="0"
            height="0"
            sizes="100vw"
            className="w-full h-24 p-4 object-cover"
            priority={true}
          />
        </div>
        <Link
          href={"/"}
          className={`${
            isActive("/") ? "text-[#ffffff] bg-[#14121F]" : "text-[#949CA9]"
          } p-4 block hover:bg-[#14121F]`}
        >
          <div className="flex items-center gap-3 text-[#009EF7] rounded-lg cursor-pointer transition-colors">
            <LayoutGrid fill={"#009EF7"} />
            <span className="text-white text-sm font-medium">Dashboard</span>
          </div>
        </Link>
        <div className="space-y-2 pb-12">
          {/* Add more sidebar items here */}
          <SidebarItem
            title="Ads"
            icon={ShoppingBag}
            href="/ads"
            subItems={[{ title: "All Ads", href: "/ads/all" }]}
            setMobileSidebarOpen={setMobileSidebarOpen}
          />
          <SidebarItem
            title="Ad Categories"
            icon={ChartBarStacked}
            href="/categories"
            subItems={[
              { title: "All Categories", href: "/categories/all" },
              { title: "Create Category", href: "/categories/create" },
            ]}
            setMobileSidebarOpen={setMobileSidebarOpen}
          />
          <SidebarItem
            title="Content Management"
            icon={Library}
            href="/blogs"
            subItems={[
              { title: "All Blog", href: "/blogs/all" },
              { title: "Create Blog", href: "/blogs/create" },
            ]}
            setMobileSidebarOpen={setMobileSidebarOpen}
          />
          <SidebarItem
            title="Contest"
            icon={Trophy}
            href="/contests"
            subItems={[
              { title: "All Contest", href: "/contests/all" },
              { title: "Create Contest", href: "/contests/create" },
            ]}
            setMobileSidebarOpen={setMobileSidebarOpen}
          />
          <SidebarItem
            title="Users"
            icon={Users}
            href="/admins"
            subItems={[
              { title: "All Admins", href: "/admins/all" },
              { title: "All Sellers", href: "/sellers" },
              { title: "Create Admin", href: "/admins/create" },
            ]}
            setMobileSidebarOpen={setMobileSidebarOpen}
          />
          <SidebarItem
            title="User Roles"
            icon={UserCog}
            href="/roles"
            subItems={[
              { title: "All Roles", href: "/roles/all" },
              { title: "Create Role", href: "/roles/create" },
              { title: "All Permissions", href: "/permissions/all" },
              { title: "Create Permission", href: "/permissions/create" },
            ]}
            setMobileSidebarOpen={setMobileSidebarOpen}
          />
          <SidebarItem
            title="Ad Reports"
            icon={Flag}
            href="/ad-reports"
            subItems={[
              { title: "Ad Reports", href: "/ad-reports/all" },
            ]}
            setMobileSidebarOpen={setMobileSidebarOpen}
          />
        </div>
      </div>
    </ScrollArea>
  );

  return (
    <div className="flex h-screen">
      {/* Mobile Sidebar Container - Always rendered */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ease-in-out ${
          mobileSidebarOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Overlay with opacity transition */}
        <div
          className={`absolute inset-0 bg-black ${
            mobileSidebarOpen ? "opacity-50" : "opacity-0"
          } transition-opacity duration-300 ease-in-out`}
          onClick={() => setMobileSidebarOpen(false)}
        ></div>
      </div>

      {/* Sidebar Content with transform transition */}
      <div
        className={`absolute z-50 left-0 top-0 h-full w-64 bg-[#1E1E2D] transition-transform duration-300 ease-in-out ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:h-full md:w-64">{sidebarContent}</div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar with mobile toggle button */}
        <Navbar
          setMobileSidebarOpen={setMobileSidebarOpen}
          mobileSidebarOpen={mobileSidebarOpen}
        />
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-secondary-background md:bg-background md:p-6">{children}</main>
      </div>
    </div>
  );
}
