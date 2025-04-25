import React from "react";
import Navbar from "@/layout/Navbar";
import Sidebar from "@/layout/Sidebar";
import { Container } from "lucide-react";

export default function Home() {
    return (
        <>
        <div className="flex justify-between">

   
        <Sidebar/><div className="flex-1">
        <Navbar />
        </div>
        </div>
    </>
    );
    }