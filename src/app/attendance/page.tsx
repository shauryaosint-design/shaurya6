import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/Sidebar";

export default async function AttendancePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const records = await prisma.attendance.findMany({
    orderBy: { date: "desc" },
    include: { student: { include: { user: true } } },
    take: 50,
  });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar user={session} />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Attendance</h1>
          <p className="text-sm text-slate-500">Recent records</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Subject</th>
                <th className="px-4 py-3 font-medium">Period</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    {new Date(r.date).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    {r.student.user.firstName} {r.student.user.lastName}
                  </td>
                  <td className="px-4 py-3">{r.subjectCode || "—"}</td>
                  <td className="px-4 py-3">{r.period || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        r.status === "PRESENT"
                          ? "bg-emerald-50 text-emerald-700"
                          : r.status === "ABSENT"
                          ? "bg-rose-50 text-rose-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
