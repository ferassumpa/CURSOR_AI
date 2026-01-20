"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "../components/sidebar";

export default function PlaygroundPage() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsLoading(true);
    
    // Redireciona para /protected com a key como query parameter
    const encodedKey = encodeURIComponent(apiKey.trim());
    router.push(`/protected?key=${encodedKey}`);
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-white via-white to-zinc-50 text-zinc-900 dark:from-black dark:via-black dark:to-zinc-950 dark:text-zinc-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
      />

      <div
        className={`flex-1 px-8 py-8 transition-all duration-300 ${
          isSidebarOpen ? "ml-60" : "ml-0"
        }`}
      >
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
          {/* Header */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Pages / API Playground
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
              API Playground
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Test your API key to verify it works correctly before integrating into your application.
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="apiKey"
                  className="text-sm font-semibold text-zinc-800 dark:text-zinc-200"
                >
                  Enter your API Key
                </label>
                <input
                  id="apiKey"
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="tvly-dev-xxxx-xxxx-xxxx"
                  className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 font-mono text-sm text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-indigo-400"
                />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Your API key should start with &quot;tvly-dev-&quot; or &quot;tvly-live-&quot;
                </p>
              </div>

              <button
                type="submit"
                disabled={!apiKey.trim() || isLoading}
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-600 hover:to-purple-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Validating...
                  </>
                ) : (
                  <>
                    <span>Validate API Key</span>
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Info Card */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                  How it works
                </h3>
                <p className="mt-1 text-sm text-blue-800 dark:text-blue-200">
                  Enter your API key and click validate. We&apos;ll check if the key exists,
                  is active, and hasn&apos;t exceeded its usage limits. Valid keys will
                  grant you access to the protected area.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

