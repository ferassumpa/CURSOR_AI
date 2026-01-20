"use client";

interface SuccessToastProps {
  message: string | null;
}

export function SuccessToast({ message }: SuccessToastProps) {
  if (!message) return null;

  const isDeleted = message.includes("deleted");

  return (
    <div
      className={`fixed top-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-xl px-5 py-3 text-sm text-white shadow-lg ring-1 ${
        isDeleted ? "bg-red-600 ring-red-600" : "bg-emerald-600 ring-emerald-600"
      }`}
    >
      <span
        className={`inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[13px] font-bold ${
          isDeleted ? "text-red-600" : "text-emerald-600"
        }`}
      >
        ✓
      </span>
      <span>{message}</span>
    </div>
  );
}

interface CopiedToastProps {
  label: string | null;
}

export function CopiedToast({ label }: CopiedToastProps) {
  if (!label) return null;

  return (
    <div className="fixed top-16 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-xl bg-zinc-900 px-4 py-3 text-sm text-zinc-50 shadow-lg ring-1 ring-zinc-800/80 dark:bg-zinc-900 dark:text-zinc-50">
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-bold text-white">
        ✓
      </span>
      <div className="flex flex-col">
        <span className="font-semibold">Copied to clipboard</span>
        <span className="text-xs text-zinc-300">
          Key for &quot;{label}&quot; is now ready to paste.
        </span>
      </div>
    </div>
  );
}
