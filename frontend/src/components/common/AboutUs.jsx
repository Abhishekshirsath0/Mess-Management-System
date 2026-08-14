import { Utensils, ShieldCheck, Clock, Users, HeartHandshake } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="space-y-8 text-gray-900 dark:text-gray-100 max-w-5xl mx-auto py-6">
      {/* Header */}
      <div className="text-center space-y-3 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xs">
        <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 uppercase tracking-wider">
          About MessMaster Pro
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
          Revolutionizing Mess & Tiffin Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
          MessMaster Pro is a modern, web-based platform built to simplify daily meal tracking, attendance recording, menu management, and automated subscription handling for messes and students.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
            <Utensils size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Fresh & Hygienic Food</h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            We provide nutritious, homely meals prepared daily with high quality ingredients and clean culinary standards.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Clock size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Real-time Attendance</h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Automated meal tracking allows students and mess owners to monitor daily lunch, dinner, and extra tiffin consumption transparently.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Transparent Billing</h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Clear plan breakdowns (BASIC, STANDARD, PREMIUM) with automated payment status tracking and custom deposit management.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <HeartHandshake className="text-indigo-600 dark:text-indigo-400" /> Our Mission
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          Our mission is to eliminate paper registers and manual ledger errors by delivering an intuitive, real-time web solution. Whether you are a student tracking your monthly meal records or a mess administrator managing hundreds of daily diners, MessMaster Pro ensures accuracy, speed, and peace of mind.
        </p>
      </div>
    </div>
  );
}
