"use client";

interface ApiKeysSectionProps {
  isLoading: boolean;
  isCreating: boolean;
  onRefresh: () => void;
  onCreateNew: () => void;
  children: React.ReactNode;
}

export function ApiKeysSection({
  isLoading,
  isCreating,
  onRefresh,
  onCreateNew,
  children,
}: ApiKeysSectionProps) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Pages / Overview
            </p>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              API Keys
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Use keys to authenticate requests to your API. Manage, rotate, and revoke here.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-zinc-900 dark:text-emerald-200">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              Operational
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onRefresh}
                disabled={isLoading}
                className="h-11 rounded-full border border-zinc-200 px-4 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-900"
              >
                Refresh
              </button>
              <button
                type="button"
                onClick={onCreateNew}
                disabled={isCreating}
                className="flex h-11 items-center gap-2 rounded-full bg-black px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                <span className="text-lg leading-none">+</span>
                New Key
              </button>
            </div>
          </div>
        </div>
      </div>

      {children}
    </section>
  );
}
