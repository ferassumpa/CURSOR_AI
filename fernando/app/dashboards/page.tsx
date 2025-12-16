/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useMemo, useState } from "react";

interface ApiKey {
  id: string;
  label: string;
  key: string;
  type: "dev" | "live";
  usage: number;
  status: "Active" | "Pending" | "Revoked";
  lastUsed: string;
}

function generateKey(): string {
  const head = Math.random().toString(36).slice(2, 6);
  const mid = Math.random().toString(36).slice(2, 6);
  const tail = Math.random().toString(36).slice(2, 6);
  return `tvly-dev-${head}-${mid}-${tail}`;
}

function maskKey(key: string): string {
  const visible = key.slice(0, 8);
  return `${visible}************************`;
}

export default function DashboardsPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isMutatingId, setIsMutatingId] = useState<string | null>(null);
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLabel, setModalLabel] = useState("");
  const [modalType, setModalType] = useState<"dev" | "live">("dev");
  const [modalLimitEnabled, setModalLimitEnabled] = useState(false);
  const [modalLimit, setModalLimit] = useState("100");

  const modalHasError = useMemo(
    () => modalLabel.trim().length === 0 || (modalLimitEnabled && !modalLimit),
    [modalLabel, modalLimitEnabled, modalLimit],
  );

  async function fetchKeys() {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/keys", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load keys");
      const payload = (await response.json()) as { data?: ApiKey[] };
      setKeys(payload.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load keys");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateFromModal() {
    if (modalHasError) return;
    setIsCreating(true);
    try {
      const response = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: modalLabel,
          type: modalType,
          limitMonthly: modalLimitEnabled ? Number(modalLimit) : null,
        }),
      });
      if (!response.ok) throw new Error("Failed to create key");
      await fetchKeys();
      setModalLabel("");
      setModalType("dev");
      setModalLimitEnabled(false);
      setModalLimit("100");
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create key");
    } finally {
      setIsCreating(false);
    }
  }

  async function handleRename(id: string) {
    const current = keys.find((item) => item.id === id);
    const nextLabel = window.prompt("New label", current?.label ?? "");
    if (!nextLabel) return;
    setIsMutatingId(id);
    try {
      const response = await fetch("/api/keys", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, label: nextLabel.trim() }),
      });
      if (!response.ok) throw new Error("Failed to rename key");
      await fetchKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to rename key");
    } finally {
      setIsMutatingId(null);
    }
  }

  async function handleRevoke(id: string) {
    setIsMutatingId(id);
    try {
      const response = await fetch("/api/keys", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "Revoked" }),
      });
      if (!response.ok) throw new Error("Failed to revoke key");
      await fetchKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to revoke key");
    } finally {
      setIsMutatingId(null);
    }
  }

  async function handleDelete(id: string) {
    setIsMutatingId(id);
    try {
      const response = await fetch("/api/keys", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error("Failed to delete key");
      await fetchKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete key");
    } finally {
      setIsMutatingId(null);
    }
  }

  async function handleRegenerate(id: string) {
    setIsMutatingId(id);
    try {
      const response = await fetch("/api/keys", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, regenerate: true }),
      });
      if (!response.ok) throw new Error("Failed to regenerate key");
      await fetchKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to regenerate key");
    } finally {
      setIsMutatingId(null);
    }
  }

  async function handleCopy(id: string) {
    const current = keys.find((item) => item.id === id);
    if (!current) return;
    try {
      await navigator.clipboard.writeText(current.key);
    } catch {
      // ignore clipboard errors
    }
  }

  function toggleVisibility(id: string) {
    setVisibleIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  useEffect(() => {
    fetchKeys();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-zinc-50 px-6 py-12 text-zinc-900 dark:from-black dark:via-black dark:to-zinc-950 dark:text-zinc-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <div className="rounded-3xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-blue-500 p-[1px] shadow-lg">
          <div className="rounded-[22px] bg-white/80 p-6 backdrop-blur dark:bg-zinc-950/70">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/90 dark:text-white">
                Current Plan
              </p>
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h1 className="text-3xl font-semibold text-white">Researcher</h1>
                  <p className="text-sm text-white/80">Monthly plan • 0 / 1,000 Credits</p>
                </div>
                <button className="h-11 rounded-full bg-white px-5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100 dark:bg-zinc-100 dark:text-zinc-950">
                  Manage Plan
                </button>
              </div>
            </div>
          </div>
        </div>

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
                    onClick={fetchKeys}
                    disabled={isLoading}
                    className="h-11 rounded-full border border-zinc-200 px-4 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-900"
                  >
                    Refresh
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
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

          <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Usage</th>
                  <th className="px-4 py-3 font-semibold">Key</th>
                  <th className="px-4 py-3 font-semibold text-right">Options</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {isLoading ? (
                  <tr>
                    <td className="px-4 py-4 text-sm text-zinc-500" colSpan={5}>
                      Loading keys…
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td className="px-4 py-4 text-sm text-red-600 dark:text-red-300" colSpan={5}>
                      {error}
                    </td>
                  </tr>
                ) : keys.length === 0 ? (
                  <tr>
                    <td className="px-4 py-4 text-sm text-zinc-500" colSpan={5}>
                      No keys yet. Click “New Key” to create one.
                    </td>
                  </tr>
                ) : (
                  keys.map((item) => {
                    const isBusy = isMutatingId === item.id;
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-zinc-50 dark:hover:bg-zinc-900"
                      >
                        <td className="px-4 py-3 font-medium">{item.label}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                            {item.type}
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
                              onClick={() => handleCopy(item.id)}
                              className="rounded-lg border border-zinc-200 px-2.5 py-1.5 transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                            >
                              Copy
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRename(item.id)}
                              disabled={isBusy}
                              className="rounded-lg border border-zinc-200 px-2.5 py-1.5 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:hover:bg-zinc-900"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRegenerate(item.id)}
                              disabled={isBusy}
                              className="rounded-lg border border-zinc-200 px-2.5 py-1.5 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:hover:bg-zinc-900"
                            >
                              Regenerate
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRevoke(item.id)}
                              disabled={isBusy}
                              className="rounded-lg border border-amber-200 px-2.5 py-1.5 text-amber-800 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-amber-900 dark:text-amber-200 dark:hover:bg-amber-950/40"
                            >
                              Revoke
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
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
        </section>

        {isModalOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-950">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  Create a new API key
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-zinc-500 transition hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  ✕
                </button>
              </div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Enter a name and limit for the new API key.
              </p>

              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    Key Name
                  </label>
                  <input
                    value={modalLabel}
                    onChange={(event) => setModalLabel(event.target.value)}
                    placeholder="A unique name to identify this key"
                    className="h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-white"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    Key Type
                  </p>
                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => setModalType("dev")}
                      className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                        modalType === "dev"
                          ? "border-blue-500 bg-blue-50/70 text-blue-900 shadow-sm dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-100"
                          : "border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-900/70"
                      }`}
                    >
                      <span
                        className={`mt-1 inline-block h-3 w-3 rounded-full border ${
                          modalType === "dev"
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
                      onClick={() => setModalType("live")}
                      className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                        modalType === "live"
                          ? "border-emerald-500 bg-emerald-50/70 text-emerald-900 shadow-sm dark:border-emerald-400 dark:bg-emerald-950/40 dark:text-emerald-100"
                          : "border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-900/70"
                      }`}
                    >
                      <span
                        className={`mt-1 inline-block h-3 w-3 rounded-full border ${
                          modalType === "live"
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

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    <input
                      type="checkbox"
                      checked={modalLimitEnabled}
                      onChange={(event) => setModalLimitEnabled(event.target.checked)}
                      className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:checked:bg-blue-500"
                    />
                    Limit monthly usage
                  </label>
                  <input
                    type="number"
                    value={modalLimit}
                    onChange={(event) => setModalLimit(event.target.value)}
                    disabled={!modalLimitEnabled}
                    placeholder="1000"
                    className="h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-black disabled:cursor-not-allowed disabled:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:disabled:bg-zinc-800"
                  />
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    If combined usage exceeds your account limit, requests will be rejected.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 rounded-full px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateFromModal}
                  disabled={modalHasError || isCreating}
                  className="h-10 rounded-full bg-indigo-500 px-5 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCreating ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

