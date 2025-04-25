import React from "react";
import Navbar from "@/layout/Navbar";
import Sidebar from "@/layout/Sidebar";
import { Container } from "lucide-react";

export default function Home() {
    return (
        <>
        <div className="flex w-full border-b-amber-700 ">
        <div><Sidebar/></div>
        <div className="flex-1  border-b-amber-700 ">
            
        <Navbar />
        <p>dnskncx</p>
        </div>
        </div>
    </>
    );
    }