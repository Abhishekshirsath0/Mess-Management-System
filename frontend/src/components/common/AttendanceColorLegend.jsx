import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

const LEGEND_ITEMS = [
  {
    color: "bg-emerald-500",
    border: "border-emerald-500 dark:border-emerald-800",
    bg: "bg-white dark:bg-emerald-950/60",
    text: "text-black dark:text-emerald-300",
    sub: "text-gray-700 dark:text-emerald-300",
    icon: CheckCircle2,
    iconColor: "text-emerald-600 dark:text-emerald-400",
    label: "Green = Present",
    description: "Student attended mess on this date",
  },
  {
    color: "bg-rose-500",
    border: "border-rose-500 dark:border-rose-800",
    bg: "bg-white dark:bg-rose-950/60",
    text: "text-black dark:text-rose-300",
    sub: "text-gray-700 dark:text-rose-300",
    icon: XCircle,
    iconColor: "text-rose-600 dark:text-rose-400",
    label: "Red = Absent",
    description: "Marked absent for this date",
  },
  {
    color: "bg-amber-500",
    border: "border-amber-400 dark:border-amber-800",
    bg: "bg-white dark:bg-amber-950/60",
    text: "text-black dark:text-amber-300",
    sub: "text-gray-700 dark:text-amber-300",
    icon: AlertCircle,
    iconColor: "text-amber-600 dark:text-amber-400",
    label: "Yellow = Not Marked",
    description: "No record submitted for this date",
  },
];

export default function AttendanceColorLegend() {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border-2 border-black dark:border-slate-800 shadow-xs">
      <h2 className="text-xs uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400 mb-3">
        Attendance Color Legend
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold">
        {LEGEND_ITEMS.map((item) => (
          <div
            key={item.label}
            className={`flex items-center gap-3 p-3 ${item.bg} border ${item.border} rounded-xl`}
          >
            <span className={`w-4 h-4 rounded-full ${item.color} shrink-0 inline-block shadow-xs`} />
            <div className="flex flex-col">
              <span className={`text-sm font-bold flex items-center gap-1.5 ${item.text}`}>
                <item.icon className={`w-4 h-4 ${item.iconColor}`} /> {item.label}
              </span>
              <span className={`text-[11px] font-normal ${item.sub}`}>{item.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
