"use client"

import {Bar, BarChart, CartesianGrid, XAxis, YAxis} from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {useIsMobile} from "@/app/hooks/use-mobile";
import {useApiRequest} from "@/app/hooks/useApiRequest";
import {useEffect, useState} from "react";
import {getCookie} from "@/app/lib/cookies";
import Loader from "@/app/lib/Loader";
const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
    { month: "July", desktop: 186, mobile: 80 },
    { month: "August", desktop: 305, mobile: 200 },
    { month: "September", desktop: 237, mobile: 120 },
    { month: "October", desktop: 73, mobile: 190 },
    { month: "November", desktop: 209, mobile: 130 },
    { month: "December", desktop: 214, mobile: 140 },
]

const chartConfig = {
    ads: {
        label: "Ads",
        color: "hsl(var(--bar-visitors))",
    },
    ads_sold: {
        label: "Ads sold",
        color: "hsl(var(--bar-sales))",
    },
}

export function BarChartGraph({barChart}) {
    const isMobile = useIsMobile();

    return (
        <Card className="max-w-4xl shadow-none border-none border-0 rounded-none bg-background">
            <CardHeader className={"px-0"}>
                <CardTitle className="text-[20px] tracking-normal font-medium">Sales Statistics</CardTitle>
            </CardHeader>
            <CardContent className={"p-0"}>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={barChart}>
                        <CartesianGrid vertical={false} />
                        <YAxis tickLine={false}
                               tickMargin={10}
                               axisLine={false}
                               />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar
                            dataKey="ads"
                            stackId="a"
                            radius={[2, 2, 8, 8]}
                            barSize={isMobile? 20 : 30}
                            className={"fill-bar-sales"}
                            fill={"hsl(var(--bar-visitors))"}
                        />
                        <Bar
                            dataKey="ads_sold"
                            stackId="a"
                            radius={[8, 8, 0, 0]}
                            barSize={isMobile? 20 : 30}
                            className={"fill-bar-visitors"}
                            fill={"hsl(var(--bar-sales))"}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>

        </Card>
    )
}
