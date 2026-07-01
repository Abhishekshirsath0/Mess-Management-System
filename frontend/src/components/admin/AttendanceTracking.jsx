import { useState, useEffect } from "react";
import { getUserdatafromserver } from "../../service";

export default function AttendanceTable() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUserdatafromserver();
        console.log(data);
        setMembers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredMembers = members.filter((member) =>
    (member.name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center p-8 text-lg">
        Loading...
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
                      {member.payment || "Pending"}
                    </span>
                  </td>

                  <td className="p-4">
                    {member.status || "Active"}
                  </td>

                  <td className="p-4 text-right">
                    {member.lastEntry || "--"}
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