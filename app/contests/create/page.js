"use client"
import BlogForm from "@/components/blog/BlogForm";
import {useState} from "react";
import ContestForm from "@/components/contest/ContestForm";

export default function page(){
  const [contests, setContests] = useState([])

  return(
    <div className={"p-6 pb-0 md:p-0 md:pb-6"}>
      <h2 className="text-2xl font-medium">Create Contest</h2>
      <ContestForm setContests={setContests}/>
    </div>
  )
}