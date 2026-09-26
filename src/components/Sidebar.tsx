"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  IndianRupee,
  CalendarCheck,
  UserPlus,
  LogOut,
  Building2,
  BookOpen,
} from "lucide-react";
import clsx from "clsx";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/students", label: "Students", icon: Users },
  { href: "/admissions", label: "Admissions", icon: UserPlus },
  { href: "/fees", label: "Fees", icon: IndianRupee },
  { href: "/attendance", label: "Attendance", icon: CalendarCheck },
];

export default function Sidebar({
  user,
}: {
  user: { firstName: string; lastName: string; role: string; email: string };
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col shrink-0">
      <div className="p-5 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center font-bold">
            M
          </div>
          <div>
            <div className="font-semibold text-sm">MPGI ERP</div>
            <div className="text-[10px] text-slate-400">v1.0 · Next-Gen</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition",
                active
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="text-xs text-slate-400 mb-1">Signed in as</div>
        <div className="font-medium text-sm truncate">
          {user.firstName} {user.lastName}
        </div>
        <div className="text-[11px] text-slate-500 truncate mb-3">{user.role}</div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition w-full"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
