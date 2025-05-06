"use client";

import { useApiRequest } from "@/app/hooks/useApiRequest";
import { getCookie } from "@/app/lib/cookies";
import {
    Table,
    TableBody,
    TableCell,
    TableRow
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import Loader from "@/app/lib/Loader";

export function TopSoldProduct() {
    const { makeRequest, data, loading, error } = useApiRequest();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchTopProducts = async () => {
            try {
                const token = getCookie("token");
                const responseData = await makeRequest({
                    url: `${process.env.NEXT_PUBLIC_API_URL}/dashboards/top-sold-ads`,
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'ngrok-skip-browser-warning': 'true',
                    },
                });

                setProducts(responseData.data.top_sold_ads);
            } catch (error) {
                console.error("Error fetching top sold products:", error);
            }
        };

        fetchTopProducts();
    }, []);

    if(loading) return <Loader/>;
    return (
        <div className="pt-6">
            <h1 className="text-[20px] font-medium mb-4">Top Ads</h1>
            <Table className="border-collapse">
                <TableBody>
                    {products.length > 0 ? (
                        products.map((product, index) => (
                            <TableRow key={product.id} className="border-none">
                                <TableCell className={"flex justify-center"}>
                                    <img
                                        src={product.media?.[0].original_url}
                                        alt="ads Image"
                                        className="h-auto w-14 rounded-full"
                                    />
                                </TableCell>
                                <TableCell className=" text-[14px] font-normal">{product.title || "No Title Available"}</TableCell>
                                <TableCell className=" text-[14px] font-normal">{product.price || "N/A"} {product.currency}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow className="border-none">
                            <TableCell colSpan={3} className="text-gray-600 text-center">None</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
