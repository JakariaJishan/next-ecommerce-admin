import {Button} from "@/components/ui/button";
import {X} from "lucide-react";
import {DatePickerWithRange} from "@/components/ui/DatePickerWithRange";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {format} from "date-fns";
import {CiSearch} from "react-icons/ci";
import {useState} from "react";

export default function Filters({statusOptions=null, search=false,searchQuery, setSearchQuery, status, startDate, endDate, setStartDate, setEndDate, setStatus, setCurrentPage}) {
  const [query, setQuery] = useState("")
  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setCurrentPage(1)
  };

  const handleSearchQuery= (e) => {
    e.preventDefault()
    setSearchQuery(query)
    setCurrentPage(1)
  }
  const handleDateChange = (newStartDate, newEndDate) => {
    setStartDate(format(newStartDate, "yyyy-MM-dd"));
    setEndDate(format(newEndDate, "yyyy-MM-dd"));
    setCurrentPage(1)
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setStatus("");
    setSearchQuery("");
    setQuery("")
  }

  return (
    <div className="flex justify-between md:items-center flex-col md:flex-row gap-4">
      {/* Left Side: Order Details & Created At */}
      {
        statusOptions ? (<div className="flex gap-2 items-center">
          <Select  onValueChange={(value) => handleStatusChange(value)}>
            <SelectTrigger
              className="w-full md:w-[250px] flex justify-between items-center bg-secondary shadow-none border-none">
              <SelectValue placeholder="Select Status"/>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>) : search ?
          <form onSubmit={handleSearchQuery} className="relative flex-1">
            {/* Search Icon */}
            <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />

            {/* Input Field */}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="bg-secondary pl-10 rounded-md px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </form>
          :
          <div></div>
      }

      {/* Right Side: Dropdown, Date Picker, Printer Icon (Aligned Horizontally) */}
      <div className="flex justify-between md:items-center gap-2">
        <DatePickerWithRange onDateChange={handleDateChange}/>
        {
          (startDate || endDate || status || searchQuery) && <Button variant={"ghost"} className={"font-normal"} onClick={handleClearFilter}><X /></Button>
        }
      </div>
    </div>
  )
}