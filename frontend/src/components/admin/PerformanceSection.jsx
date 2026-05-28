// src/components/PerformanceSection.jsx

const monthlyData = [60, 75, 90, 85, 40, 55];

const dailyData = [
  {
    title: "Morning",
    amount: "$4,200",
    progress: "70%",
  },
  {
    title: "Lunch",
    amount: "$6,850",
    progress: "95%",
  },
  {
    title: "Dinner",
    amount: "$1,400",
    progress: "25%",
  },
];

export default function PerformanceSection() {
  return (
    <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Monthly */}
      <div className="bg-white rounded-2xl border p-4 md:p-6 shadow-sm">
        <h2 className="text-xl md:text-2xl font-bold mb-6">
          Monthly Performance
        </h2>

        <div className="h-52 md:h-64 flex items-end gap-3 md:gap-4">
          {monthlyData.map((item, index) => (
            <div
              key={index}
              className="flex-1 bg-black rounded-t-xl"
              style={{ height: `${item}%` }}
            />
          ))}
        </div>
      </div>

      {/* Daily */}
      <div className="bg-white rounded-2xl border p-4 md:p-6 shadow-sm">
        <h2 className="text-xl md:text-2xl font-bold mb-6">
          Daily Performance
        </h2>

        <div className="space-y-6">
          {dailyData.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between mb-2 text-sm md:text-base">
                <span>{item.title}</span>

                <span className="font-semibold">
                  {item.amount}
                </span>
              </div>

              <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black"
                  style={{
                    width: item.progress,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}