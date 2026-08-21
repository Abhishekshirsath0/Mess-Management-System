import { useState, useEffect } from "react";
import { getUserdatafromserver, getAttendanceByDate } from "../../service";
import { RingLoader } from "react-spinners";
const todayStr = () => new Date().toISOString().split("T")[0];

export default function AttendanceTable() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsersAndAttendance = async () => {
      try {
        const date = todayStr();
        const [users, records] = await Promise.all([
          getUserdatafromserver(),
          getAttendanceByDate(date),
        ]);

        const mapped = users.map((u, index) => {
          const rec = records.find((r) => String(r.userId) === String(u.id));
          let lastEntryText = "--";
          if (rec) {
            const mealsArr = [];
            if (rec.lunch) mealsArr.push("Lunch");
            if (rec.dinner) mealsArr.push("Dinner");
            if (rec.extraTiffin > 0) mealsArr.push(`+${rec.extraTiffin} Tiffin`);
            lastEntryText = mealsArr.length ? mealsArr.join(", ") : "Present";
          }

          return {
            id: u.id,
            rollNo: index + 1,
            name: u.name,
            mobile: u.mobile,
            payment: u.paymentStatus || "Pending",
            status: rec ? (rec.status === "present" ? "Present" : "Absent") : "Not Marked",
            lastEntry: lastEntryText,
          };
        });

        setMembers(mapped);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndAttendance();
  }, []);

  const filteredMembers = members.filter((member) =>
    (member.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
    String(member.rollNo).includes(search)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-12">
        <RingLoader color={"#6366f1"} />
      </div>
    );
  }

  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden text-gray-900 dark:text-white">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold">
          Today's Attendance
        </h2>

        <input
          type="text"
          placeholder="Search by name, roll no..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-72"
        />
      </div>

      <div className="overflow-y-auto max-h-[500px]">
        <table className="w-full min-w-[900px]">
          <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0 border-b border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-200">
            <tr>
              <th className="text-left p-4">Roll No</th>
              <th className="text-left p-4">Member</th>
              <th className="text-left p-4">Mobile</th>
              <th className="text-left p-4">Payment</th>
              <th className="text-left p-4">Status</th>
              <th className="text-right p-4">Last Entry</th>
            </tr>
          </thead>

          <tbody>
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member, index) => (
                <tr
                  key={member.id}
                  className="border-t border-gray-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="p-4 font-bold text-gray-700 dark:text-gray-300">
                    {index + 1}
                  </td>

                  <td className="p-4 font-medium">
                    {member.name}
                  </td>

                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                    {member.mobile}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        member.payment === "Paid"
                          ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 border border-green-200 dark:border-green-800"
                          : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-800"
                      }`}
                    >
                      {member.payment}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        member.status === "Present"
                          ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 border border-green-200 dark:border-green-800"
                          : member.status === "Absent"
                          ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-800"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>

                  <td className="p-4 text-right font-medium text-gray-700 dark:text-gray-300">
                    {member.lastEntry}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center p-6 text-gray-500 dark:text-gray-400"
                >
                  No members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}