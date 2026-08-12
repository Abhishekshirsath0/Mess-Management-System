import {
    ChevronLeft,
    ChevronRight,
    Users,
} from "lucide-react";
import { RingLoader } from "react-spinners";

export default function HistoryTable({
    history,
    paginatedHistory,
    loading,
    error,

    currentPage,
    setCurrentPage,

    totalPages,
    itemsPerPage,
}) {
    const formatDate = (dateString) => {
        if (!dateString) return "-";

        return new Date(dateString).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };


    const formatTime = (record) => {
        if (record.status === "absent") return "-";

        const timestamp =
            record.updatedAt ||
            record.createdAt ||
            record.date;

        if (!timestamp) return "-";

        return new Date(timestamp).toLocaleTimeString(
            "en-US",
            {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            }
        );
    };


    const renderMealBadge = (record) => {
        if (record.status === "absent") {
            return (
                <span className="text-gray-400">
                    -
                </span>
            );
        }

        if (record.lunch && record.dinner) {
            return (
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    Lunch & Dinner
                </span>
            );
        }

        if (record.lunch) {
            return (
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                    Lunch
                </span>
            );
        }

        if (record.dinner) {
            return (
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                    Dinner
                </span>
            );
        }

        return (
            <span className="text-gray-500">
                None
            </span>
        );
    };


    // ================= LOADING =================

    if (loading) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 py-20 flex justify-center">
                <RingLoader
                    color="#6366f1"
                    size={50}
                />
            </div>
        );
    }


    // ================= ERROR =================

    if (error) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-10 text-center text-red-500">
                {error}
            </div>
        );
    }


    // ================= EMPTY =================

    if (paginatedHistory.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-12 text-center">

                <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />

                <h3 className="font-bold text-gray-700 dark:text-gray-300">
                    No Attendance Records Found
                </h3>

                <p className="text-xs text-gray-400 mt-1">
                    Try changing your filters.
                </p>

            </div>
        );
    }


    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">


            {/* ================= TABLE ================= */}

            <div className="overflow-x-auto">

                <table className="w-full text-left text-sm">

                    <thead className="bg-slate-100 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-800">

                        <tr>

                            <th className="p-4">
                                User
                            </th>

                            <th className="p-4">
                                Mobile / Email
                            </th>

                            <th className="p-4">
                                Date
                            </th>

                            <th className="p-4">
                                Meal Type
                            </th>

                            <th className="p-4">
                                Status
                            </th>

                            <th className="p-4">
                                Time
                            </th>

                            <th className="p-4">
                                Extra Tiffin
                            </th>

                        </tr>

                    </thead>


                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">

                        {paginatedHistory.map((item) => {

                            const userName =
                                item.userName ||
                                item.userId?.Name ||
                                "User";

                            const contact =
                                item.userId?.Mobile
                                    ? String(item.userId.Mobile)
                                    : item.userId?.Email || "-";

                            return (
                                <tr
                                    key={item._id}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                >

                                    <td className="p-4 font-semibold">
                                        {userName}
                                    </td>

                                    <td className="p-4 text-xs text-gray-500">
                                        {contact}
                                    </td>

                                    <td className="p-4 text-xs font-semibold">
                                        {formatDate(item.date)}
                                    </td>

                                    <td className="p-4">
                                        {renderMealBadge(item)}
                                    </td>

                                    <td className="p-4">

                                        {item.status === "present" ? (
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
                                                Present
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                                                Absent
                                            </span>
                                        )}

                                    </td>

                                    <td className="p-4 text-xs text-gray-500">
                                        {formatTime(item)}
                                    </td>

                                    <td className="p-4 font-semibold">
                                        {item.extraTiffin || 0}
                                    </td>

                                </tr>
                            );
                        })}

                    </tbody>

                </table>

            </div>


            {/* ================= PAGINATION ================= */}

            <div className="p-4 border-t border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">

                <span className="text-gray-500">

                    Showing{" "}

                    <b>
                        {history.length === 0
                            ? 0
                            : (currentPage - 1) *
                            itemsPerPage +
                            1}
                    </b>

                    {" "}to{" "}

                    <b>
                        {Math.min(
                            currentPage * itemsPerPage,
                            history.length
                        )}
                    </b>

                    {" "}of{" "}

                    <b>
                        {history.length}
                    </b>

                    {" "}records

                </span>


                <div className="flex items-center gap-2">

                    <button
                        onClick={() =>
                            setCurrentPage((p) =>
                                Math.max(p - 1, 1)
                            )
                        }
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 rounded-lg border disabled:opacity-40 flex items-center gap-1"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Prev
                    </button>


                    <span>
                        Page {currentPage} of {totalPages}
                    </span>


                    <button
                        onClick={() =>
                            setCurrentPage((p) =>
                                Math.min(
                                    p + 1,
                                    totalPages
                                )
                            )
                        }
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 rounded-lg border disabled:opacity-40 flex items-center gap-1"
                    >
                        Next
                        <ChevronRight className="w-4 h-4" />
                    </button>

                </div>

            </div>

        </div>
    );
}