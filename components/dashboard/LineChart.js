"use client"

import { FaBagShopping } from "react-icons/fa6";
import { IoLogoUsd } from "react-icons/io";
import { LuShoppingCart } from "react-icons/lu";
import { useTheme } from "next-themes";
import LineCard from "@/components/dashboard/LineCard";

export default function LineChartGraph({lineChart}) {
    // Dynamic chart data with icons
    const {theme} = useTheme()
    const chartItems = [
        { icon: LuShoppingCart, bg: "#EBFDEF", strokeColor: "#99D1A6" },
        { icon: IoLogoUsd, bg: "#E8EFF9", strokeColor: "#A288EC" },
        { icon: FaBagShopping, bg: "#FFEFE7", strokeColor: "#FFA071" },
    ];

    return (
        <div className="columns-1 md:columns-3 space-y-8 gap-8 p-6">
            {lineChart?.map((item, index) => (
                <div
                    key={index}
                    className={`rounded-[28px] max-w-lg col-span-2 row-span-3 p-6 bg-card`}
                    style={{ backgroundColor: theme==='dark' ? '' :  chartItems[index].bg }}
                    >
                    <LineCard item={item} Icon={chartItems[index].icon} strokeColor={chartItems[index].strokeColor}/>
                </div>
            ))}
        </div>
    )
}
