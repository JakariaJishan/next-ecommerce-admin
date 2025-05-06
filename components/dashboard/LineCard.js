import { Line, LineChart, ResponsiveContainer } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import {useEffect, useState} from "react";
import {getCookie} from "@/app/lib/cookies";
import {useApiRequest} from "@/app/hooks/useApiRequest";
import Loader from "@/app/lib/Loader";
import {Star} from "lucide-react";

const chartData = [
  { month: "January", desktop: 86 },
  { month: "February", desktop: 505 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 773 },
  { month: "May", desktop: 1000 },
]

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--chart-1))",
  },
}

export default function LineCard({ item, Icon, strokeColor }) {
  return (
    <div className=" w-full p-2 gap-4 flex items-center justify-between">
      {/* Left Side: Icon on Top, Title Below (Left-aligned) */}
      <div className="flex flex-col items-start">
        {/* White Background Icon Wrapper */}
        <div className="bg-[#282828] p-3 rounded-full shadow-md flex items-center justify-center w-12 h-12">
          <Icon className="text-xl text-[#FFFFFF]"/> {/* Icon */}
        </div>
        <p className="text-[28px] font-bold py-2">{item?.total}</p>
        <p className="text-sm font-medium text-[#737676]">{item?.label}</p>
      </div>

      {/* Right Side: Graph */}
      <div className="w-5/12 md:w-2/3 ">
        <ChartContainer config={chartConfig}>
            <LineChart
              data={item?.chart_data}
              width={131}
              height={74}
            >
              <Line
                dataKey="count"
                type="monotone"
                stroke={strokeColor}
                strokeWidth={8}
                dot={false}
              />
            </LineChart>
        </ChartContainer>
      </div>
    </div>
  )
}