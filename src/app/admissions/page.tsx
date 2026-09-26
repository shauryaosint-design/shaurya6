import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/Sidebar";

export default async function AdmissionsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const enquiries = await prisma.admissionEnquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar user={session} />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Admission Enquiries</h1>
          <p className="text-sm text-slate-500">{enquiries.length} leads</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Program Interest</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {enquiries.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{e.fullName}</td>
                  <td className="px-4 py-3">{e.phone}</td>
                  <td className="px-4 py-3">{e.programInterest || "—"}</td>
                  <td className="px-4 py-3">{e.source || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded">
                      {e.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(e.createdAt).toLocaleDateString("en-IN")}
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
