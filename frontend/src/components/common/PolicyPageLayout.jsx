export default function PolicyPageLayout({ icon: Icon, title, children }) {
  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100 max-w-4xl mx-auto py-6">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-gray-100 dark:border-slate-800 pb-4">
          <Icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">{title}</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Last updated: August 14, 2026</p>
          </div>
        </div>
        <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
