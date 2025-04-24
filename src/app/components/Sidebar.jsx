import Link from 'next/link';

export default function SideBar() {
    return (
        <aside className="w-64 bg-slate-800 p-6 space-y-6">
     <h1 className="text-xl font-bold">Administrator</h1>
      <nav className="flex flex-col gap-4">
        <Link href="/" className="hover:text-teal-400">Dashboard</Link>
        <Link href="/team" className="hover:text-teal-400">Manage Team</Link>
        <Link href="/invoices" className="hover:text-teal-400">Invoices</Link>
      </nav>
    </aside>
  );
}