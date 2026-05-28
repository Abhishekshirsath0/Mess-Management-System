import { useState } from "react";

const initialMembers = [
  {
    id: 1,
    rollNo: 101,
    name: "Jameson Cooper",
    mobile: "9876543210",
    payment: "Paid",
    status: "Active",
    entry: "08:14 AM",
    lunch: false,
    dinner: false,
    extraTiffin: 0,
  },
  {
    id: 2,
    rollNo: 102,
    name: "Maya Sterling",
    mobile: "9876543211",
    payment: "Pending",
    status: "Active",
    entry: "08:22 AM",
    lunch: false,
    dinner: false,
    extraTiffin: 0,
  },
  {
    id: 3,
    rollNo: 103,
    name: "Leo Vance",
    mobile: "9876543212",
    payment: "Paid",
    status: "Inactive",
    entry: "08:45 AM",
    lunch: false,
    dinner: false,
    extraTiffin: 0,
  },
  {
    id: 4,
    rollNo: 104,
    name: "Adeline Wells",
    mobile: "9876543213",
    payment: "Paid",
    status: "Active",
    entry: "09:02 AM",
    lunch: false,
    dinner: false,
    extraTiffin: 0,
  },
  {
    id: 5,
    rollNo: 105,
    name: "John Smith",
    mobile: "9876543214",
    payment: "Paid",
    status: "Active",
    entry: "09:10 AM",
    lunch: false,
    dinner: false,
    extraTiffin: 0,
  },
  {
    id: 6,
    rollNo: 106,
    name: "Emma Brown",
    mobile: "9876543215",
    payment: "Pending",
    status: "Inactive",
    entry: "09:20 AM",
    lunch: false,
    dinner: false,
    extraTiffin: 0,
  },
];

export const View_Attends = () => {
  const [members, setMembers] = useState(initialMembers);
  const [search, setSearch] = useState("");

  // SEARCH FILTER
  const filteredMembers = members.filter((m) => {
    const q = search.toLowerCase();

    return (
      m.name.toLowerCase().includes(q) ||
      m.mobile.includes(q) ||
      String(m.rollNo).includes(q)
    );
  });

  // TOTAL COUNTS
  const totalPresent = members.filter(
    (m) => m.status === "Active"
  ).length;

  const totalAbsent = members.filter(
    (m) => m.status === "Inactive"
  ).length;

  const totalLunch = members.filter(
    (m) => m.lunch
  ).length;

  const totalDinner = members.filter(
    (m) => m.dinner
  ).length;

  const totalExtraTiffin = members.reduce(
    (acc, curr) => acc + curr.extraTiffin,
    0
  );

  const toggleStatus = (id, newStatus) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: newStatus } : m
      )
    );
  };

  const toggleMeal = (id, field) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, [field]: !m[field] } : m
      )
    );
  };

  const updateExtraTiffin = (id, action) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;

        let count = m.extraTiffin;

        if (action === "add") count += 1;
        if (action === "remove" && count > 0) count -= 1;

        return { ...m, extraTiffin: count };
      })
    );
  };

  const handleSave = () => {
    console.log("Saved Data:", members);
    alert("Attendance Saved Successfully!");
  };

  return (
    <section className="bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col">

      {/* HEADER */}
      <div className="p-4 md:p-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold">
          Today's Attendance
        </h2>

        {/* SEARCH BAR */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, roll no, mobile..."
          className="border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-black w-full md:w-72"
        />
      </div>

      {/* TABLE */}
      <div className="overflow-auto max-h-[500px]">
        <table className="w-full min-w-[1100px]">

          <thead className="bg-slate-100 sticky top-0 z-10">
            <tr>
              <th className="p-4 text-left">Roll No</th>
              <th className="p-4 text-left">Member</th>
              <th className="p-4 text-left">Mobile</th>
              <th className="p-4 text-left">Payment</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Lunch</th>
              <th className="p-4 text-left">Dinner</th>
              <th className="p-4 text-left">Extra Tiffin</th>
              <th className="p-4 text-right">Entry</th>
            </tr>
          </thead>

          <tbody>
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  className="border-t hover:bg-slate-50"
                >

                  {/* ROLL NO */}
                  <td className="p-4 font-semibold">
                    {member.rollNo}
                  </td>

                  {/* NAME */}
                  <td className="p-4 font-medium">
                    {member.name}
                  </td>

                  {/* MOBILE */}
                  <td className="p-4 text-sm text-gray-600">
                    {member.mobile}
                  </td>

                  {/* PAYMENT */}
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

                  {/* STATUS */}
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() =>
                        toggleStatus(member.id, "Active")
                      }
                      className={`px-3 py-1 rounded-lg text-sm transition ${
                        member.status === "Active"
                          ? "bg-green-600 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      Present
                    </button>

                    <button
                      onClick={() =>
                        toggleStatus(member.id, "Inactive")
                      }
                      className={`px-3 py-1 rounded-lg text-sm transition ${
                        member.status === "Inactive"
                          ? "bg-red-600 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      Absent
                    </button>
                  </td>

                  {/* LUNCH */}
                  <td className="p-4">
                    <button
                      onClick={() =>
                        toggleMeal(member.id, "lunch")
                      }
                      className={`px-3 py-1 rounded-lg text-sm transition ${
                        member.lunch
                          ? "bg-orange-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      Lunch
                    </button>
                  </td>

                  {/* DINNER */}
                  <td className="p-4">
                    <button
                      onClick={() =>
                        toggleMeal(member.id, "dinner")
                      }
                      className={`px-3 py-1 rounded-lg text-sm transition ${
                        member.dinner
                          ? "bg-purple-600 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      Dinner
                    </button>
                  </td>

                  {/* EXTRA TIFFIN */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">

                      <button
                        onClick={() =>
                          updateExtraTiffin(member.id, "remove")
                        }
                        className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                      >
                        -
                      </button>

                      <span className="w-6 text-center font-semibold">
                        {member.extraTiffin}
                      </span>

                      <button
                        onClick={() =>
                          updateExtraTiffin(member.id, "add")
                        }
                        className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                      >
                        +
                      </button>

                    </div>
                  </td>

                  {/* ENTRY */}
                  <td className="p-4 text-right text-sm text-gray-600">
                    {member.entry}
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="text-center p-6 text-gray-500"
                >
                  No members found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* SUMMARY */}
      <div className="border-t bg-slate-50 p-4">

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

          <div className="bg-green-100 text-green-700 rounded-xl p-4">
            <p className="text-sm">Present</p>
            <h3 className="text-2xl font-bold">
              {totalPresent}
            </h3>
          </div>

          <div className="bg-red-100 text-red-700 rounded-xl p-4">
            <p className="text-sm">Absent</p>
            <h3 className="text-2xl font-bold">
              {totalAbsent}
            </h3>
          </div>

          <div className="bg-orange-100 text-orange-700 rounded-xl p-4">
            <p className="text-sm">Lunch</p>
            <h3 className="text-2xl font-bold">
              {totalLunch}
            </h3>
          </div>

          <div className="bg-purple-100 text-purple-700 rounded-xl p-4">
            <p className="text-sm">Dinner</p>
            <h3 className="text-2xl font-bold">
              {totalDinner}
            </h3>
          </div>

          <div className="bg-blue-100 text-blue-700 rounded-xl p-4">
            <p className="text-sm">Extra Tiffin</p>
            <h3 className="text-2xl font-bold">
              {totalExtraTiffin}
            </h3>
          </div>

        </div>

      </div>

      {/* SAVE BUTTON */}
      <div className="p-4 border-t flex justify-between items-center">

        <div className="text-sm text-gray-500">
          Total Members: {members.length}
        </div>

        <button
          onClick={handleSave}
          className="bg-black text-white px-6 py-2 rounded-xl hover:bg-gray-800 transition"
        >
          Save Attendance
        </button>

      </div>

    </section>
  );
};