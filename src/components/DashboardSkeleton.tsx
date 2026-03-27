export function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* KPI skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-card border border-border" />
        ))}
      </div>
      {/* Chart skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-80 rounded-xl bg-card border border-border" />
        <div className="h-80 rounded-xl bg-card border border-border" />
      </div>
      {/* Table skeleton */}
      <div className="h-64 rounded-xl bg-card border border-border" />
    </div>
  );
}
