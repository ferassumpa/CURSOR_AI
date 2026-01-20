"use client";

import { useState } from "react";
import type { ApiKey } from "../../types/api-key";
import { maskKey } from "../../lib/utils";

interface ApiKeyTableProps {
  keys: ApiKey[];
  isLoading: boolean;
  error: string | null;
  isMutatingId: string | null;
  onRename: (id: string) => void;
  onRevoke: (id: string) => void;
  onActivate: (id: string) => void;
  onDelete: (id: string) => void;
  onRegenerate: (id: string) => void;
  onCopy: (id: string) => void;
}

export function ApiKeyTable({
  keys,
  isLoading,
  error,
  isMutatingId,
  onRename,
  onRevoke,
  onActivate,
  onDelete,
  onRegenerate,
  onCopy,
}: ApiKeyTableProps) {
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());

  function toggleVisibility(id: string) {
    setVisibleIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
          <tr>
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Type</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Usage</th>
            <th className="px-4 py-3 font-semibold">Key</th>
            <th className="px-4 py-3 font-semibold text-right">Options</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {isLoading ? (
            <tr>
              <td className="px-4 py-4 text-sm text-zinc-500" colSpan={6}>
                Loading keys…
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td className="px-4 py-4 text-sm text-red-600 dark:text-red-300" colSpan={6}>
                {error}
              </td>
            </tr>
          ) : keys.length === 0 ? (
            <tr>
              <td className="px-4 py-4 text-sm text-zinc-500" colSpan={6}>
                No keys yet. Click &quot;New Key&quot; to create one.
              </td>
            </tr>
          ) : (
            keys.map((item) => {
              const isBusy = isMutatingId === item.id;
              const isRevoked = item.status === "Revoked";
              return (
                <tr
                  key={item.id}
                  className={`hover:bg-zinc-50 dark:hover:bg-zinc-900 ${isRevoked ? "opacity-60" : ""}`}
                >
                  <td className="px-4 py-3 font-medium">{item.label}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                        item.status === "Active"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200"
                          : item.status === "Revoked"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          item.status === "Active"
                            ? "bg-emerald-500"
                            : item.status === "Revoked"
                            ? "bg-red-500"
                            : "bg-amber-500"
                        }`}
                      />
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {item.usage ?? 0}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-700 dark:text-zinc-200">
                    {visibleIds.has(item.id) ? item.key : maskKey(item.key)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-end gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                      <button
                        type="button"
                        onClick={() => toggleVisibility(item.id)}
                        className="rounded-lg border border-zinc-200 px-2.5 py-1.5 transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                      >
                        {visibleIds.has(item.id) ? "Hide" : "Show"}
                      </button>
                      <button
                        type="button"
                        onClick={() => onCopy(item.id)}
                        className="rounded-lg border border-zinc-200 px-2.5 py-1.5 transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                      >
                        Copy
                      </button>
                      <button
                        type="button"
                        onClick={() => onRename(item.id)}
                        disabled={isBusy}
                        className="rounded-lg border border-zinc-200 px-2.5 py-1.5 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:hover:bg-zinc-900"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onRegenerate(item.id)}
                        disabled={isBusy}
                        className="rounded-lg border border-zinc-200 px-2.5 py-1.5 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:hover:bg-zinc-900"
                      >
                        Regenerate
                      </button>
                      {isRevoked ? (
                        <button
                          type="button"
                          onClick={() => onActivate(item.id)}
                          disabled={isBusy}
                          className="rounded-lg border border-emerald-200 px-2.5 py-1.5 text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-emerald-900 dark:text-emerald-200 dark:hover:bg-emerald-950/40"
                        >
                          Activate
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onRevoke(item.id)}
                          disabled={isBusy}
                          className="rounded-lg border border-amber-200 px-2.5 py-1.5 text-amber-800 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-amber-900 dark:text-amber-200 dark:hover:bg-amber-950/40"
                        >
                          Revoke
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onDelete(item.id)}
                        disabled={isBusy}
                        className="rounded-lg border border-red-200 px-2.5 py-1.5 text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900 dark:text-red-200 dark:hover:bg-red-950"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
