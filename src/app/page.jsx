import React from "react";
import Navbar from "@/layout/Navbar";
import Sidebar from "@/layout/Sidebar";
import { Container } from "lucide-react";

export default function Home() {
    return (
        <>
        <div className="flex border-b border-dark-700">
       <Sidebar />
 <div className="flex-1 flex flex-col ">
        <Navbar />
        </div>
        </div>
      

    </>
    );
    }