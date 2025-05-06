"use client"
import {DataTable} from "@/shared/data-table";
import {columns} from "@/app/blogs/all/columns";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {IoMdAdd} from "react-icons/io";
import {useEffect, useState} from "react";
import BlogForm from "@/components/blog/BlogForm";
import Link from "next/link";
import {useApiRequest} from "@/app/hooks/useApiRequest";
import {getCookie} from "@/app/lib/cookies";
import Loader from "@/app/lib/Loader";
import CategoryForm from "@/components/category/category-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {ChevronDown} from "lucide-react";
import {DatePickerWithRange} from "@/components/ui/DatePickerWithRange";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Command, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import ContestForm from "@/components/contest/ContestForm";
import Pagination from "@/components/pagination/Pagination";
import {usePagination} from "@/app/hooks/usePagination";
import useFilter from "@/app/hooks/useFilter";
import Filters from "@/components/filters/Filters";

export default function page(){
  const { makeRequest, loading, error } = useApiRequest();
  const [blogs, setBlogs] = useState([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const {currentPage, totalPages, handlePageClick, updateTotalPages, setCurrentPage, totalItems} = usePagination();
  const {status, setStatus, startDate, setStartDate, endDate, setEndDate, buildQueryParams} = useFilter()

  const statusOptions = [
    {value: "draft", label: "Draft"},
    {value: "published", label: "Published"},
    {value: "archived", label: "Archived"}
  ];

  useEffect(() => {
    async function fetchProducts() {
      try {
        const token = getCookie("token");
        const queryParams = buildQueryParams();

        const response = await makeRequest({
          url: `${process.env.NEXT_PUBLIC_API_URL}/blog-posts?page=${currentPage}&${queryParams}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept": "application/json",
            'ngrok-skip-browser-warning': 'true'
          },
          isFormData: true,
        });

        setBlogs(response.data.blog_posts);
        updateTotalPages(response.metadata.pagination);

      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    }

    fetchProducts();
  }, [currentPage, status, startDate, endDate]);

  return (
    <div>
      <div className="flex justify-between items-center p-6 pb-0 md:p-0 md:pb-6 ">
        <h2 className="text-2xl font-medium">Blog List</h2>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button className="bg-[#009EF7] text-[#FFFFFF] font-medium flex items-center gap-2">
              <IoMdAdd />
              Add Blog
            </Button>
          </SheetTrigger>

          {/* Sheet Content */}
          <SheetContent className="max-h-screen overflow-y-auto md:max-w-[50rem]">
            <SheetHeader>
              <SheetTitle>Add Blog</SheetTitle>
            </SheetHeader>
            {/* Add Your Form or Other Content Here */}
            <BlogForm setProducts={setBlogs} setSheetOpen={setSheetOpen}/>
          </SheetContent>
        </Sheet>
      </div>

      <div className={"bg-secondary-background rounded-md p-6"}>
        <Filters statusOptions={statusOptions}
                 setStatus={setStatus}
                 startDate={startDate}
                 endDate={endDate}
                 setEndDate={setEndDate}
                 setStartDate={setStartDate}
                 status={status}
                 setCurrentPage={setCurrentPage}
        />
        <div className="p-6 space-y-6">
          {
            loading ? <Loader/> : error ? (
              <div className={"text-center"}>{error}</div>
            ) : <DataTable columns={columns(blogs, setBlogs)} data={blogs} />
          }
          <Pagination pageCount={totalPages}
                      handlePageClick={handlePageClick}
                      currentPage={currentPage}
                      totalItems={totalItems}
          />
        </div>
      </div>
    </div>
  )
}