import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/Sidebar";

export default async function FeesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const payments = await prisma.feePayment.findMany({
    orderBy: { paidAt: "desc" },
    include: { student: { include: { user: true } }, feeStructure: true },
    take: 50,
  });

  const total = payments.reduce((s, p) => s + p.paidAmount, 0);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar user={session} />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Fee Payments</h1>
          <p className="text-sm text-slate-500">
            Total collected: ₹{total.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Receipt</th>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Mode</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs">{p.receiptNo}</td>
                  <td className="px-4 py-3">
                    {p.student.user.firstName} {p.student.user.lastName}
                    <div className="text-xs text-slate-400">{p.student.enrollmentNo}</div>
                  </td>
                  <td className="px-4 py-3 font-medium">₹{p.paidAmount.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3">{p.paymentMode}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded">
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(p.paidAt).toLocaleDateString("en-IN")}
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
