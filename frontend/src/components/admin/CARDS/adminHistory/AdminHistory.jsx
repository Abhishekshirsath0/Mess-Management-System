import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    getAllAttendanceHistory,
    getUserdatafromserver,
} from "../../service";
import { History } from "lucide-react";

import HistoryFilters from "./HistoryFilters";
import HistoryTable from "./HistoryTable";

const getStoredAdmin = () => {
    const saved = localStorage.getItem("user");

    if (!saved) return null;

    try {
        const user = JSON.parse(saved);
        return user?.role === "admin" ? user : null;
    } catch {
        return null;
    }
};

const getErrorMessage = (err, fallback) => {
    if (typeof err === "string") return err;
    if (err?.message) return err.message;
    return fallback;
};

export default function AdminHistory() {
    const [adminUser] = useState(getStoredAdmin);

    const [history, setHistory] = useState([]);
    const [users, setUsers] = useState([]);

    const [summary, setSummary] = useState({
        totalRecords: 0,
        totalPresent: 0,
        totalAbsent: 0,
        totalLunch: 0,
        totalDinner: 0,
        totalExtraTiffin: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters
    const [search, setSearch] = useState("");
    const [selectedUserId, setSelectedUserId] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [mealFilter, setMealFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState("newest");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 12;

    // ================= GET USERS =================

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUserdatafromserver();
                setUsers(data || []);
            } catch (err) {
                console.error("Failed to load users:", err);
            }
        };

        fetchUsers();
    }, []);

    // ================= GET HISTORY =================

    const fetchAdminHistory = async () => {
        if (!adminUser) {
            setError("Admin login required.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const params = {
                search: search.trim() || undefined,

                userId:
                    selectedUserId !== "all"
                        ? selectedUserId
                        : undefined,

                startDate: startDate || undefined,
                endDate: endDate || undefined,

                status: statusFilter,
                mealType: mealFilter,
                sort: sortOrder,
            };

            const res = await getAllAttendanceHistory(params);

            setHistory(res.data || []);

            if (res.summary) {
                setSummary(res.summary);
            }
        } catch (err) {
            console.error(err);

            setError(
                getErrorMessage(
                    err,
                    "Failed to load attendance history."
                )
            );
        } finally {
            setLoading(false);
        }
    };

    // ================= FILTER CHANGE =================

    useEffect(() => {
        setCurrentPage(1);

        fetchAdminHistory();
    }, [
        search,
        selectedUserId,
        startDate,
        endDate,
        statusFilter,
        mealFilter,
        sortOrder,
    ]);

    // ================= RESET =================

    const handleResetFilters = () => {
        setSearch("");
        setSelectedUserId("all");
        setStartDate("");
        setEndDate("");
        setStatusFilter("all");
        setMealFilter("all");
        setSortOrder("newest");

        setCurrentPage(1);
    };

    // ================= PAGINATION =================

    const totalPages =
        Math.ceil(history.length / itemsPerPage) || 1;

    const paginatedHistory = history.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // ================= ADMIN CHECK =================

    if (!adminUser) {
        return (
            <div className="space-y-4 text-center py-16 text-black dark:text-white">

                <History className="w-12 h-12 mx-auto text-gray-300" />

                <h2 className="text-xl font-bold">
                    Admin Access Required
                </h2>

                <p className="text-sm text-gray-500">
                    Please login with an admin account.
                </p>

                <Link
                    to="/login"
                    className="inline-block mt-2 bg-black text-white px-5 py-2 rounded-xl text-sm"
                >
                    Go to Login
                </Link>

            </div>
        );
    }

    return (
        <div className="space-y-6 text-black dark:text-white">

            {/* HEADER */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">

                        <History className="w-7 h-7 text-indigo-600" />

                        All Attendance History

                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Complete attendance and tiffin records
                    </p>
                </div>

            </div>


            {/* FILTERS */}

            <HistoryFilters
                search={search}
                setSearch={setSearch}

                users={users}
                selectedUserId={selectedUserId}
                setSelectedUserId={setSelectedUserId}

                startDate={startDate}
                setStartDate={setStartDate}

                endDate={endDate}
                setEndDate={setEndDate}

                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}

                mealFilter={mealFilter}
                setMealFilter={setMealFilter}

                sortOrder={sortOrder}
                setSortOrder={setSortOrder}

                handleResetFilters={handleResetFilters}
            />


            {/* TABLE */}

            <HistoryTable
                history={history}
                paginatedHistory={paginatedHistory}
                loading={loading}
                error={error}

                currentPage={currentPage}
                setCurrentPage={setCurrentPage}

                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
            />

        </div>
    );
}