'use client'
import LineChartGraph from "@/components/dashboard/LineChart";
import {BarChartGraph} from "@/components/dashboard/BarChart";
import {PieChartGraph, TopSoldProduct} from "@/components/dashboard/TopSoldProduct";
import LatestOrders from "@/components/dashboard/LatestOrders";
import {useApiRequest} from "@/app/hooks/useApiRequest";
import {useEffect, useState} from "react";
import {getCookie} from "@/app/lib/cookies";
import Loader from "@/app/lib/Loader";

export default function Home() {
  const {makeRequest, loading, error} = useApiRequest();
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    async function fetchMonthlyData() {
      try {
        const token = getCookie("token");

        const response = await makeRequest({
          url: `${process.env.NEXT_PUBLIC_API_URL}/dashboards/summary`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept": "application/json",
            'ngrok-skip-browser-warning': 'true'
          },
          isFormData: true,
        });

        setSummary(response.data);

      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    }

    fetchMonthlyData();
  }, []);

  if (loading) return <Loader/>;

  return (
    <>
      <div className={"bg-background"}>
        <div className={"flex justify-between items-center p-6 md:pt-0"}>
          <h2 className="text-2xl font-medium">Dashboard</h2>
        </div>
        {/* Line Chart */}
        <LineChartGraph lineChart={summary?.line_chart}/>

        {/* Bar and Top Sold Products Charts */}
        <div className="flex flex-col md:flex-row gap-4 p-6">
          <div className="md:w-2/3">
            <BarChartGraph barChart={summary?.bar_chart}/>
          </div>
          <div className="md:w-1/3">
            <TopSoldProduct/>
          </div>
        </div>

        <LatestOrders/>
      </div>
    </>

  );

}
