"use client";

import { useState, useMemo } from "react";

interface CreateKeyModalProps {
  isOpen: boolean;
  isCreating: boolean;
  onClose: () => void;
  onCreate: (data: {
    label: string;
    type: "dev" | "live";
    limitMonthly: number | null;
  }) => void;
}

export function CreateKeyModal({
  isOpen,
  isCreating,
  onClose,
  onCreate,
}: CreateKeyModalProps) {
  const [label, setLabel] = useState("");
  const [type, setType] = useState<"dev" | "live">("dev");
  const [limitEnabled, setLimitEnabled] = useState(false);
  const [limit, setLimit] = useState("100");

  const hasError = useMemo(
    () => label.trim().length === 0 || (limitEnabled && !limit),
    [label, limitEnabled, limit]
  );

  function handleSubmit() {
    if (hasError) return;
    onCreate({
      label: label.trim(),
      type,
      limitMonthly: limitEnabled ? Number(limit) : null,
    });
    // Reset form
    setLabel("");
    setType("dev");
    setLimitEnabled(false);
    setLimit("100");
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-950">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Create a new API key
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-500 transition hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            ✕
          </button>
        </div>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Enter a name and limit for the new API key.
        </p>

        <div className="mt-4 space-y-4">
          {/* Key Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              Key Name
            </label>
            <input
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder="A unique name to identify this key"
              className="h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-white"
            />
          </div>

          {/* Key Type Selection */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              Key Type
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setType("dev")}
                className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                  type === "dev"
                    ? "border-blue-500 bg-blue-50/70 text-blue-900 shadow-sm dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-100"
                    : "border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-900/70"
                }`}
              >
                <span
                  className={`mt-1 inline-block h-3 w-3 rounded-full border ${
                    type === "dev"
                      ? "border-blue-500 bg-blue-500"
                      : "border-zinc-300"
                  }`}
                />
                <div>
                  <p className="text-sm font-semibold">Development</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Rate limited to 100 requests/minute
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setType("live")}
                className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                  type === "live"
                    ? "border-emerald-500 bg-emerald-50/70 text-emerald-900 shadow-sm dark:border-emerald-400 dark:bg-emerald-950/40 dark:text-emerald-100"
                    : "border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-900/70"
                }`}
              >
                <span
                  className={`mt-1 inline-block h-3 w-3 rounded-full border ${
                    type === "live"
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-zinc-300"
                  }`}
                />
                <div>
                  <p className="text-sm font-semibold">Production</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Rate limited to 1,000 requests/minute
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Monthly Limit */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
              <input
                type="checkbox"
                checked={limitEnabled}
                onChange={(event) => setLimitEnabled(event.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:checked:bg-blue-500"
              />
              Limit monthly usage
            </label>
            <input
              type="number"
              value={limit}
              onChange={(event) => setLimit(event.target.value)}
              disabled={!limitEnabled}
              placeholder="1000"
              className="h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-black disabled:cursor-not-allowed disabled:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:disabled:bg-zinc-800"
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              If combined usage exceeds your account limit, requests will be rejected.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-full px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={hasError || isCreating}
            className="h-10 rounded-full bg-indigo-500 px-5 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCreating ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
