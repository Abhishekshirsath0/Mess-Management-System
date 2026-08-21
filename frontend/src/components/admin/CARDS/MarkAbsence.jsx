import { useState, useEffect } from "react";
import {
  getUserdatafromserver,
  postAbsence,
  getAbsences,
  updateAbsence,
  deleteAbsence,
} from "../../../service";
import { RingLoader } from "react-spinners";
import {
  CalendarOff,
  User,
  Calendar as CalendarIcon,
  FileText,
  Save,
  Trash2,
  Edit2,
  RefreshCw,
  Search,
  AlertCircle,
  CheckCircle2,
  X,
  Utensils,
  HelpCircle,
} from "lucide-react";

export default function MarkAbsence() {
  const [users, setUsers] = useState([]);
  const [absences, setAbsences] = useState([]);

  // Form states
  const [selectedUserId, setSelectedUserId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [mealType, setMealType] = useState("Both");
  const [reason, setReason] = useState("");

  // Loading & status states
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingAbsences, setLoadingAbsences] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formError, setFormError] = useState("");

  // Confirmation Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");

  // Edit Modal State
  const [editingAbsence, setEditingAbsence] = useState(null);
  const [editFromDate, setEditFromDate] = useState("");
  const [editToDate, setEditToDate] = useState("");
  const [editMealType, setEditMealType] = useState("Both");
  const [editReason, setEditReason] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState("");

  // Delete State
  const [deletingId, setDeletingId] = useState(null);

  // Fetch users & existing absence ranges on mount
  useEffect(() => {
    fetchUsers();
    fetchAbsences();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const userList = await getUserdatafromserver();
      setUsers(userList || []);
    } catch (err) {
      console.error("Failed to load members:", err);
      setError("Failed to load members list.");
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchAbsences = async () => {
    try {
      setLoadingAbsences(true);
      setError(null);
      const res = await getAbsences();
      setAbsences(res.data || []);
    } catch (err) {
      console.error("Failed to load absence records:", err);
      setError(err.message || "Failed to load absence records.");
    } finally {
      setLoadingAbsences(false);
    }
  };

  const formatDDMMYYYY = (dateStr) => {
    if (!dateStr) return "";
    const cleanDate = dateStr.split("T")[0];
    const parts = cleanDate.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const handleFormSubmitInit = (e) => {
    e.preventDefault();
    setFormError("");
    setSuccess(null);

    if (!selectedUserId) {
      setFormError("Please select a mess member.");
      return;
    }
    if (!fromDate) {
      setFormError("Please select From Date.");
      return;
    }
    if (!toDate) {
      setFormError("Please select To Date.");
      return;
    }
    if (new Date(fromDate) > new Date(toDate)) {
      setFormError("From Date cannot be after To Date.");
      return;
    }

    // Open confirmation modal
    setShowConfirmModal(true);
  };

  const executeSaveAbsence = async () => {
    setShowConfirmModal(false);
    try {
      setSubmitting(true);
      setFormError("");
      const res = await postAbsence({
        userId: selectedUserId,
        fromDate,
        toDate,
        mealType,
        reason: reason.trim(),
      });

      setSuccess(
        res.message ||
        `Absence marked successfully from ${formatDDMMYYYY(fromDate)} to ${formatDDMMYYYY(toDate)}.`
      );
      setSelectedUserId("");
      setFromDate("");
      setToDate("");
      setMealType("Both");
      setReason("");
      fetchAbsences();
    } catch (err) {
      console.error("Save absence failed:", err);
      setFormError(err.message || "Failed to save absence range.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEditModal = (item) => {
    setEditingAbsence(item);
    const fDate = item.fromDate ? item.fromDate.split("T")[0] : "";
    const tDate = item.toDate ? item.toDate.split("T")[0] : "";
    setEditFromDate(fDate);
    setEditToDate(tDate);
    setEditMealType(item.mealType || "Both");
    setEditReason(item.reason || "");
    setEditError("");
  };

  const handleUpdateAbsence = async (e) => {
    e.preventDefault();
    setEditError("");

    if (!editFromDate || !editToDate) {
      setEditError("Both From Date and To Date are required.");
      return;
    }
    if (new Date(editFromDate) > new Date(editToDate)) {
      setEditError("From Date cannot be after To Date.");
      return;
    }

    try {
      setEditSubmitting(true);
      await updateAbsence(editingAbsence._id, {
        fromDate: editFromDate,
        toDate: editToDate,
        mealType: editMealType,
        reason: editReason.trim(),
      });

      setEditingAbsence(null);
      setSuccess("Absence range updated successfully.");
      fetchAbsences();
    } catch (err) {
      console.error("Update absence failed:", err);
      setEditError(err.message || "Failed to update absence range.");
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeleteAbsence = async (id) => {
    if (!window.confirm("Are you sure you want to delete this absence range?")) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteAbsence(id);
      setSuccess("Absence range deleted successfully.");
      setAbsences((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error("Delete absence failed:", err);
      setError(err.message || "Failed to delete absence range.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const diff = new Date(end) - new Date(start);
    return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)) + 1);
  };

  const selectedUserObj = users.find((u) => u.id === selectedUserId);

  const filteredAbsences = absences.filter((item) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const userName = item.userId?.Name || item.userId?.name || "";
    const email = item.userId?.Email || "";
    const mobile = String(item.userId?.Mobile || "");
    const reasonText = item.reason || "";
    const mType = item.mealType || "";
    return (
      userName.toLowerCase().includes(term) ||
      email.toLowerCase().includes(term) ||
      mobile.includes(term) ||
      reasonText.toLowerCase().includes(term) ||
      mType.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100 my-2">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-3 text-gray-900 dark:text-white">
            <CalendarOff className="w-7 h-7 text-rose-600 dark:text-rose-400" />
            Mark Student Absence
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Specify planned date ranges and meal types to mark students absent in the system.
          </p>
        </div>

        <button
          onClick={() => {
            fetchUsers();
            fetchAbsences();
          }}
          disabled={loadingAbsences}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-xl text-sm font-semibold transition cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* SUCCESS / ERROR NOTIFICATIONS */}
      {success && (
        <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-xl text-sm font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess(null)} className="text-emerald-600 dark:text-emerald-400 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 rounded-xl text-sm font-medium">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-600 dark:text-rose-400 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* MARK ABSENCE FORM CARD */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border-2 border-black dark:border-slate-800 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Mark Planned Absence Range
        </h2>

        {formError && (
          <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleFormSubmitInit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Student Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                Select Student <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  disabled={loadingUsers}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-black dark:focus:ring-indigo-500 text-gray-900 dark:text-white cursor-pointer"
                >
                  <option value="">-- Select Student --</option>
                  {users.map((u, index) => (
                    <option key={u.id} value={u.id}>
                      Roll #{index + 1} - {u.name} ({u.mobile || u.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* From Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                From Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-black dark:focus:ring-indigo-500 text-gray-900 dark:text-white"
              />
            </div>

            {/* To Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                To Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-black dark:focus:ring-indigo-500 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Meal Type Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                Meal Type <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["Lunch", "Dinner", "Both"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setMealType(type)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border cursor-pointer ${mealType === type
                        ? "bg-black text-white dark:bg-indigo-600 dark:border-indigo-500 border-black shadow-xs"
                        : "bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700"
                      }`}
                  >
                    <Utensils className="w-3.5 h-3.5" />
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason (Optional) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                Reason / Remark <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g. Out of station, Sick leave, Exam break"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-black dark:focus:ring-indigo-500 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-black hover:bg-gray-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>Saving Absence...</>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Mark Absence
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* CONFIRMATION DIALOG MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-black dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <div className="p-3 bg-amber-100 dark:bg-amber-950/80 rounded-2xl">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
                Confirm Mark Absence
              </h3>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-slate-800/80 rounded-xl border border-gray-200 dark:border-slate-700 space-y-2">
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                Are you sure you want to mark this student absent from{" "}
                <span className="text-rose-600 dark:text-rose-400">
                  {formatDDMMYYYY(fromDate)}
                </span>{" "}
                to{" "}
                <span className="text-rose-600 dark:text-rose-400">
                  {formatDDMMYYYY(toDate)}
                </span>
                ?
              </p>

              <div className="text-xs text-gray-600 dark:text-gray-300 pt-1 space-y-1">
                <div>
                  <strong>Student:</strong> {selectedUserObj?.name || "Selected Student"}
                </div>
                <div>
                  <strong>Meal Type:</strong> {mealType}
                </div>
                {reason && (
                  <div>
                    <strong>Reason:</strong> {reason}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeSaveAbsence}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
              >
                Confirm Mark Absence
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXISTING ABSENCE RANGES LIST / TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-black dark:border-slate-800 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Existing Absence Ranges
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total {filteredAbsences.length} recorded range(s)
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search member or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-black dark:focus:ring-indigo-500 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {loadingAbsences ? (
          <div className="flex justify-center items-center py-16">
            <RingLoader color="#6366f1" size={45} />
          </div>
        ) : filteredAbsences.length === 0 ? (
          <div className="p-10 text-center text-gray-500 dark:text-gray-400">
            <CalendarOff className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold">No absence ranges found.</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Use the form above to add an absence range for any student.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-800 text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800/50">
                  <th className="p-3.5 rounded-l-xl">Student Name</th>
                  <th className="p-3.5">From Date</th>
                  <th className="p-3.5">To Date</th>
                  <th className="p-3.5">Meal Type</th>
                  <th className="p-3.5">Duration</th>
                  <th className="p-3.5">Reason</th>
                  <th className="p-3.5 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {filteredAbsences.map((item) => {
                  const days = calculateDays(item.fromDate, item.toDate);
                  const memberName = item.userId?.Name || item.userId?.name || "Unknown Student";
                  const contact = item.userId?.Mobile || item.userId?.Email || "";

                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-50/80 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="p-3.5">
                        <div className="font-bold text-gray-900 dark:text-white">{memberName}</div>
                        {contact && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            {contact}
                          </div>
                        )}
                      </td>
                      <td className="p-3.5 font-medium text-gray-800 dark:text-gray-200">
                        {formatDate(item.fromDate)}
                      </td>
                      <td className="p-3.5 font-medium text-gray-800 dark:text-gray-200">
                        {formatDate(item.toDate)}
                      </td>
                      <td className="p-3.5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900">
                          {item.mealType || "Both"}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                          {days} Day{days > 1 ? "s" : ""}
                        </span>
                      </td>
                      <td className="p-3.5 text-xs text-gray-600 dark:text-gray-300 max-w-xs truncate">
                        {item.reason || <span className="text-gray-400 italic">No reason specified</span>}
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-lg transition cursor-pointer"
                          title="Edit Range"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAbsence(item._id)}
                          disabled={deletingId === item._id}
                          className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition cursor-pointer disabled:opacity-40"
                          title="Delete Range"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EDIT ABSENCE MODAL */}
      {editingAbsence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-black dark:border-slate-800 max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Edit Absence Range
              </h3>
              <button
                onClick={() => setEditingAbsence(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Updating absence for student:{" "}
              <strong className="text-gray-900 dark:text-white">
                {editingAbsence.userId?.Name || editingAbsence.userId?.name || "Student"}
              </strong>
            </p>

            {editError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateAbsence} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={editFromDate}
                  onChange={(e) => setEditFromDate(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={editToDate}
                  onChange={(e) => setEditToDate(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
                  Meal Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Lunch", "Dinner", "Both"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEditMealType(type)}
                      className={`py-2 px-2 rounded-lg text-xs font-bold border cursor-pointer ${editMealType === type
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-slate-700"
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
                  Reason / Remark
                </label>
                <input
                  type="text"
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingAbsence(null)}
                  className="px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="px-5 py-2 bg-black hover:bg-gray-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
                >
                  {editSubmitting ? "Updating..." : "Update Range"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
