import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default async function StudentsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const students = await prisma.student.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, program: true, college: true },
    take: 100,
  });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar user={session} />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Students</h1>
            <p className="text-sm text-slate-500">{students.length} records</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Enrollment</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Program</th>
                <th className="px-4 py-3 font-medium">College</th>
                <th className="px-4 py-3 font-medium">Sem</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs">{s.enrollmentNo}</td>
                  <td className="px-4 py-3 font-medium">
                    {s.user.firstName} {s.user.lastName}
                  </td>
                  <td className="px-4 py-3">{s.program.name}</td>
                  <td className="px-4 py-3">{s.college.shortName || s.college.name}</td>
                  <td className="px-4 py-3">{s.currentSem}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded">
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 && (
            <div className="p-8 text-center text-slate-400">No students found</div>
          )}
        </div>
      </main>
    </div>
  );
}
