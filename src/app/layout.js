
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/layout/Sidebar";
import Content from "@/app/content";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
      >
        
        <Sidebar />
        <div className={`w-100% py-2 px-5 transition-all duration-300 }` }>
<Content />
<script src="/app.js"></script>

</div>


        
      </body>
    </html>
  );
}