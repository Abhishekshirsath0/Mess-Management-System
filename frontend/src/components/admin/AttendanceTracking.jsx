// src/components/AttendanceTracking.jsx

const members = [
  { name: "Jameson Cooper", payment: "Paid", status: "Active", entry: "08:14 AM" },
  { name: "Maya Sterling", payment: "Pending", status: "Active", entry: "08:22 AM" },
  { name: "Leo Vance", payment: "Paid", status: "Inactive", entry: "08:45 AM" },
  { name: "Adeline Wells", payment: "Paid", status: "Active", entry: "09:02 AM" },
  { name: "John Smith", payment: "Paid", status: "Active", entry: "09:10 AM" },
  { name: "Emma Brown", payment: "Pending", status: "Inactive", entry: "09:20 AM" },
  { name: "David Lee", payment: "Paid", status: "Active", entry: "09:30 AM" },
  { name: "Sophia Wilson", payment: "Paid", status: "Active", entry: "09:40 AM" },
  { name: "Michael Scott", payment: "Pending", status: "Inactive", entry: "09:50 AM" },
];

export default function AttendanceTable() {
  return (
    <section className="bg-white rounded-2xl border shadow-sm overflow-hidden">

      {/* Header */}
      <div className="p-4 md:p-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold">
          Today's Attendance
        </h2>

        <input
          type="text"
          placeholder="Search member..."
          className="border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-black w-full md:w-72"
        />
      </div>

      {/* TABLE WRAPPER WITH SCROLL */}
      <div className="overflow-y-auto max-h-105">
        <table className="w-full min-w-162.5">

          <thead className="bg-slate-100 sticky top-0 z-10">
            <tr>
              <th className="text-left p-4">Member</th>
              <th className="text-left p-4">Payment</th>
              <th className="text-left p-4">Status</th>
              <th className="text-right p-4">Last Entry</th>
            </tr>
          </thead>

          <tbody>
            {members.map((member, index) => (
              <tr
                key={index}
                className="border-t hover:bg-slate-50"
              >
                <td className="p-4">{member.name}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      member.payment === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {member.payment}
                  </span>
                </td>

                <td className="p-4">{member.status}</td>

                <td className="p-4 text-right">
                  {member.entry}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </section>
  );
}