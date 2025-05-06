import { Dot } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarItem = ({ title, icon: Icon, href, subItems = [], setMobileSidebarOpen }) => {
  const pathname = usePathname();
  const hasSubItems = subItems.length > 0;
  const isActive = (href) => pathname === href;

  const isParentActive = (href) => {
    if (pathname.startsWith(href)) return true;
    return subItems.some(subItem => pathname.startsWith(subItem.href));
  };

  return (
    <li className={"list-none"}>
      <details
        className="group [&_summary::-webkit-details-marker]:hidden"
        open={isParentActive(href)}
      >
        <summary
          className={`flex cursor-pointer items-center justify-between rounded-lg p-4 hover:bg-[#14121F] text-[#949CA9]`}
        >
          <span className="flex items-center gap-2">
            <Icon className="text-[#494B74]" />
            <span className="text-sm font-medium">{title}</span>
          </span>
          {hasSubItems && (
            <span className="shrink-0 transition duration-300 group-open:-rotate-180">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          )}
        </summary>

        {hasSubItems && (
          <ul className="mt-2 space-y-1 px-4">
            {subItems.map(({ title, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`block rounded-lg p-4 hover:bg-[#14121F] text-sm font-medium ${
                    isActive(href)
                      ? "text-[#ffffff] bg-[#14121F]"
                      : "text-[#949CA9]"
                  }`}
                  onClick={() => setMobileSidebarOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <Dot strokeWidth={6.25} className="text-[#494B74]" />
                    {title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </details>
    </li>
  );
};

export default SidebarItem;
