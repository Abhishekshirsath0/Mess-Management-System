import { useState, useEffect } from "react";
import { getUserdatafromserver, getAttendanceByDate  } from "../../service";
import { RingLoader } from "react-spinners"
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

        const mapped = users.map((u) => {
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
    (member.name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <RingLoader color={"#ffffffff"} />
      </div>
    );
  }

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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-black w-full md:w-72"
        />
      </div>

      <div className="overflow-y-auto max-h-[500px]">
        <table className="w-full min-w-[900px]">
          <thead className="bg-slate-100 sticky top-0">
            <tr>
              <th className="text-left p-4">Member</th>
              <th className="text-left p-4">Mobile</th>
              <th className="text-left p-4">Payment</th>
              <th className="text-left p-4">Status</th>
              <th className="text-right p-4">Last Entry</th>
            </tr>
          </thead>

          <tbody>
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  className="border-t hover:bg-slate-50"
                >
                  <td className="p-4 font-medium">
                    {member.name}
                  </td>

                  <td className="p-4">
                    {member.mobile}
                  </td>

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

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        member.status === "Present"
                          ? "bg-green-100 text-green-700"
                          : member.status === "Absent"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    {member.lastEntry}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center p-6 text-gray-500"
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