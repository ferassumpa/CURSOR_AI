"use client";

interface PlanCardProps {
  planName?: string;
  planType?: string;
  usedCredits?: number;
  totalCredits?: number;
}

export function PlanCard({
  planName = "Researcher",
  planType = "Monthly plan",
  usedCredits = 0,
  totalCredits = 1000,
}: PlanCardProps) {
  return (
    <div className="rounded-3xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-blue-500 p-[1px] shadow-lg">
      <div className="rounded-[22px] bg-white/80 p-6 backdrop-blur dark:bg-zinc-950/70">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/90 dark:text-white">
            Current Plan
          </p>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-semibold text-white">{planName}</h1>
              <p className="text-sm text-white/80">
                {planType} • {usedCredits} / {totalCredits.toLocaleString()} Credits
              </p>
            </div>
            <button className="h-11 rounded-full bg-white px-5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100 dark:bg-zinc-100 dark:text-zinc-950">
              Manage Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
