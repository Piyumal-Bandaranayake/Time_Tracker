export default function StatCard({
  title,
  value,
  icon,
  color = "text-primary",
}: {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}) {
  return (
    <div className="glass p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all duration-300">
      <div className="flex items-center gap-4 mb-4">
        {icon && (
          <div className={`p-3 rounded-2xl bg-white/5 ${color}`}>
            {icon}
          </div>
        )}
        <span className="text-gray-400 font-medium">{title}</span>
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}

