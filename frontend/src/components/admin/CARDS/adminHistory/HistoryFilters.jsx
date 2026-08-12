import { Search } from "lucide-react";

export default function HistoryFilters({
    search,
    setSearch,

    users,
    selectedUserId,
    setSelectedUserId,

    startDate,
    setStartDate,

    endDate,
    setEndDate,

    statusFilter,
    setStatusFilter,

    mealFilter,
    setMealFilter,

    sortOrder,
    setSortOrder,

    handleResetFilters,
}) {
    const hasFilters =
        search ||
        selectedUserId !== "all" ||
        startDate ||
        endDate ||
        statusFilter !== "all" ||
        mealFilter !== "all" ||
        sortOrder !== "newest";

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-4">

            {/* SEARCH */}

            <div className="relative">

                <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

                <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                    }}
                    placeholder="Search by user name, mobile, email, or user ID..."
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl pl-11 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                />

            </div>


            {/* ================= FIRST ROW ================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

                {/* USER */}

                <div>

                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        User
                    </label>

                    <select
                        value={selectedUserId}
                        onChange={(e) =>
                            setSelectedUserId(e.target.value)
                        }
                        className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm"
                    >

                        <option value="all">
                            All Users
                        </option>

                        {users.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.name} ({u.mobile || u.email})
                            </option>
                        ))}

                    </select>

                </div>


                {/* FROM DATE */}

                <div>

                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        From Date
                    </label>

                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) =>
                            setStartDate(e.target.value)
                        }
                        className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm"
                    />

                </div>


                {/* TO DATE */}

                <div>

                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        To Date
                    </label>

                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) =>
                            setEndDate(e.target.value)
                        }
                        className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm"
                    />

                </div>


                {/* MEAL TYPE */}

                <div>

                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Meal Type
                    </label>

                    <select
                        value={mealFilter}
                        onChange={(e) =>
                            setMealFilter(e.target.value)
                        }
                        className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm"
                    >

                        <option value="all">
                            All Meals
                        </option>

                        <option value="lunch">
                            Lunch
                        </option>

                        <option value="dinner">
                            Dinner
                        </option>

                        <option value="both">
                            Both Lunch & Dinner
                        </option>

                    </select>

                </div>

            </div>


            {/* ================= SECOND ROW ================= */}

            <div className="flex flex-col sm:flex-row sm:items-end gap-4">

                {/* STATUS */}

                <div>

                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Status
                    </label>

                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">

                        <button
                            onClick={() => setStatusFilter("all")}
                            className={`px-4 py-2 rounded-lg ${statusFilter === "all"
                                    ? "bg-white dark:bg-slate-700 text-black dark:text-white shadow"
                                    : "text-gray-500"
                                }`}
                        >
                            All
                        </button>

                        <button
                            onClick={() => setStatusFilter("present")}
                            className={`px-4 py-2 rounded-lg ${statusFilter === "present"
                                    ? "bg-emerald-600 text-white"
                                    : "text-gray-500"
                                }`}
                        >
                            Present
                        </button>

                        <button
                            onClick={() => setStatusFilter("absent")}
                            className={`px-4 py-2 rounded-lg ${statusFilter === "absent"
                                    ? "bg-rose-600 text-white"
                                    : "text-gray-500"
                                }`}
                        >
                            Absent
                        </button>

                    </div>

                </div>


                {/* SORT BY - NEXT TO STATUS */}

                <div className="w-full sm:w-64">

                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Sort By
                    </label>

                    <select
                        value={sortOrder}
                        onChange={(e) =>
                            setSortOrder(e.target.value)
                        }
                        className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm"
                    >

                        <option value="newest">
                            Newest Date First
                        </option>

                        <option value="oldest">
                            Oldest Date First
                        </option>

                    </select>

                </div>

            </div>


            {/* RESET */}

            {hasFilters && (
                <div className="flex justify-end">

                    <button
                        onClick={handleResetFilters}
                        className="text-xs font-semibold text-indigo-600 hover:underline"
                    >
                        Reset All Filters
                    </button>

                </div>
            )}

        </div>
    );
}