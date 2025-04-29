import React from "react";
import Navbar from "@/layout/Navbar";
import Sidebar from "@/layout/Sidebar";
import { Container } from "lucide-react";

export default function Home() {
  return (
    <>
      <div className="flex w-full" >
        <div className="flex-1 ">   <Sidebar /></div>
 
      </div>
    </>
  );
}
