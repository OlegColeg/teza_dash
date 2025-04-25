import React from "react";
import Navbar from "@/layout/Navbar";
import Sidebar from "@/components/SideBar";
import { Container } from "lucide-react";

export default function Home() {
    return (
        <>
        <div className="flex justify-between">

   
        <Sidebar/><div>
        <Navbar />
        </div>
        </div>
    </>
    );
    }