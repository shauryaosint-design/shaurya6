export default function StatCard({
  title,
  value,
  subtitle,
  color = "blue",
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: "blue" | "green" | "amber" | "purple" | "rose";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
  };

  return (
    <div className={`rounded-xl border p-5 ${colors[color]}`}>
      <div className="text-sm font-medium opacity-80">{title}</div>
      <div className="text-3xl font-bold mt-1">{value}</div>
      {subtitle && <div className="text-xs mt-1 opacity-70">{subtitle}</div>}
    </div>
  );
}
