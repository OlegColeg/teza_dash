import Sidebar from "./components/Sidebar";
import "../globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex">
        <Sidebar />
        <main className="flex-1 p-4">{children}</main> {}
      </body>
    </html>
  );
}