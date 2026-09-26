import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function Home() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-900 via-brand-800 to-slate-900 flex flex-col">
      <header className="p-6 flex justify-between items-center text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xl">
            M
          </div>
          <div>
            <div className="font-semibold text-lg">MPGI ERP</div>
            <div className="text-xs text-white/70">Maharana Pratap Group of Institutions</div>
          </div>
        </div>
        <Link
          href="/login"
          className="px-5 py-2 rounded-lg bg-white text-brand-800 font-medium hover:bg-brand-50 transition"
        >
          Login
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
          Intelligent Institute
          <br />
          <span className="text-brand-300">Automation System</span>
        </h1>
        <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-10">
          Next-generation, multi-campus ERP built for MPGI. One student record.
          Real-time insights. Scalable from day one.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 font-semibold transition shadow-lg"
          >
            Get Started
          </Link>
          <a
            href="#features"
            className="px-8 py-3 rounded-xl border border-white/30 hover:bg-white/10 font-semibold transition"
          >
            Features
          </a>
        </div>
      </main>

      <section id="features" className="bg-white text-slate-800 py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Multi-Campus Ready",
              desc: "Mandhana, Bithoor and future campuses under one unified system with role-based isolation.",
            },
            {
              title: "Student Lifecycle",
              desc: "Enquiry → Admission → Academics → Fees → Attendance → Exams → Placement → Alumni.",
            },
            {
              title: "Real-time Dashboards",
              desc: "Live KPIs for leadership, principals, HODs, faculty and parents.",
            },
            {
              title: "Fee & Finance",
              desc: "Flexible structures, UPI payments, auto-reconciliation and due tracking.",
            },
            {
              title: "Attendance & OBE",
              desc: "Biometric-ready attendance and outcomes-based education support.",
            },
            {
              title: "Secure & Auditable",
              desc: "JWT auth, RBAC, full audit trails and DPDP-friendly design.",
            },
          ].map((f) => (
            <div key={f.title} className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <h3 className="font-semibold text-lg mb-2 text-brand-700">{f.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-slate-900 text-white/60 text-center py-6 text-sm">
        © {new Date().getFullYear()} Maharana Pratap Group of Institutions · Powered by MPGI Next-Gen ERP
      </footer>
    </div>
  );
}
