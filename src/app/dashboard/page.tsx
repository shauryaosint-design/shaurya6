import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [
    studentCount,
    collegeCount,
    enquiryCount,
    paymentAgg,
    recentStudents,
    recentEnquiries,
    announcements,
  ] = await Promise.all([
    prisma.student.count({ where: { status: "ACTIVE" } }),
    prisma.college.count({ where: { isActive: true } }),
    prisma.admissionEnquiry.count({ where: { status: "NEW" } }),
    prisma.feePayment.aggregate({ _sum: { paidAmount: true }, _count: true }),
    prisma.student.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true, program: true, college: true },
    }),
    prisma.admissionEnquiry.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.announcement.findMany({
      take: 3,
      orderBy: { publishedAt: "desc" },
    }),
  ]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar user={session} />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {session.firstName}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            MPGI Group Dashboard · {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Active Students" value={studentCount} color="blue" />
          <StatCard title="Colleges" value={collegeCount} color="purple" />
          <StatCard title="New Enquiries" value={enquiryCount} color="amber" />
          <StatCard
            title="Fee Collected"
            value={`₹${((paymentAgg._sum.paidAmount || 0) / 100000).toFixed(1)}L`}
            subtitle={`${paymentAgg._count} transactions`}
            color="green"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100 font-semibold">
              Recent Students
            </div>
            <div className="divide-y divide-slate-100">
              {recentStudents.map((s) => (
                <div key={s.id} className="px-5 py-3 flex justify-between items-center text-sm">
                  <div>
                    <div className="font-medium">
                      {s.user.firstName} {s.user.lastName}
                    </div>
                    <div className="text-slate-500 text-xs">
                      {s.enrollmentNo} · {s.program.name}
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded">
                    {s.status}
                  </span>
                </div>
              ))}
              {recentStudents.length === 0 && (
                <div className="px-5 py-6 text-center text-slate-400 text-sm">No students yet</div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100 font-semibold">
              Latest Admission Enquiries
            </div>
            <div className="divide-y divide-slate-100">
              {recentEnquiries.map((e) => (
                <div key={e.id} className="px-5 py-3 flex justify-between items-center text-sm">
                  <div>
                    <div className="font-medium">{e.fullName}</div>
                    <div className="text-slate-500 text-xs">
                      {e.phone} · {e.programInterest || "—"}
                    </div>
                  </div>
                  <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded">
                    {e.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100 font-semibold">
            Announcements
          </div>
          <div className="p-5 space-y-4">
            {announcements.map((a) => (
              <div key={a.id} className="border-l-4 border-blue-500 pl-4">
                <div className="font-medium">{a.title}</div>
                <p className="text-sm text-slate-600 mt-1">{a.content}</p>
                <div className="text-xs text-slate-400 mt-1">
                  {new Date(a.publishedAt).toLocaleDateString("en-IN")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
