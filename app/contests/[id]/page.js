"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-hot-toast";
import { getCookie } from "@/app/lib/cookies";
import Loader from "@/app/lib/Loader";
import { useApiRequest } from "@/app/hooks/useApiRequest";

const page = () => {
  const { id } = useParams(); // Get contest ID from URL
  const router = useRouter();
  const [contest, setContest] = useState(null);
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/contests/${id}`;
  const { makeRequest, loading, error } = useApiRequest();

  useEffect(() => {
    const fetchContestDetails = async () => {
      try {
        const token = getCookie("token");
        const response = await makeRequest({
          url: apiUrl,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        });

        const data = response.data || {};
        setContest(data.contest);
      } catch (err) {
        toast.error("Error fetching contest details");
      }
    };

    fetchContestDetails();
  }, [id]);

  if (loading) return <Loader />;
  if (!contest) return <p className="text-center text-red-500">No contest data found</p>;

  return (
    <div className="max-w-4xl mx-auto py-10">
      {loading ? (
        <Skeleton className="h-40 w-full rounded-lg mb-4" />
      ) : contest ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{contest.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Contest ID: {contest.id}</p>
            <p className="text-sm text-gray-500">
              Status: <span className="font-semibold">{contest.status}</span>
            </p>
            <p className="text-sm text-gray-500">
              Start Date: <span className="font-semibold">{contest.start_date}</span>
            </p>
            <p className="text-sm text-gray-500">
              End Date: <span className="font-semibold">{contest.end_date}</span>
            </p>

            <div
              className="mt-4 text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: contest.description }}
            />
          </CardContent>
        </Card>
      ) : (
        <p className="text-center text-red-500">Contest not found</p>
      )}

      {/* Back Button */}
      <div className="mt-6 flex justify-center">
        <Button
          className="bg-primary dark:bg-[#009EF7] text-white"
          onClick={() => router.push("/contests/all")}
        >
          Back to Contests
        </Button>
      </div>
    </div>
  );
};

export default page;
