export default function TableSkeleton({ rows = 5, cols = 6 }) {
  return (
    <div className="w-full animate-pulse space-y-3 p-4">
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div
          key={`skel-row-${rIdx}`}
          className="flex items-center justify-between gap-4 p-3 bg-gray-100 dark:bg-slate-800/60 rounded-xl"
        >
          {Array.from({ length: cols }).map((_, cIdx) => (
            <div
              key={`skel-col-${rIdx}-${cIdx}`}
              className="h-4 bg-gray-200 dark:bg-slate-700 rounded-md w-full"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
