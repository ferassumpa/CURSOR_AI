"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Sidebar } from "../components/sidebar";

interface ValidationResult {
  valid: boolean;
  error?: string;
  data?: {
    label: string;
    type: "dev" | "live";
    usage: number;
    limitMonthly: number | null;
  };
}

function ProtectedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const apiKey = searchParams.get("key");

    if (!apiKey) {
      setResult({ valid: false, error: "No API key provided" });
      setIsLoading(false);
      setShowPopup(true);
      return;
    }

    async function validateKey(key: string) {
      try {
        const response = await fetch("/api/validate-key", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key }),
        });

        const data = await response.json();
        setResult(data);
      } catch {
        setResult({ valid: false, error: "Failed to validate API key" });
      } finally {
        setIsLoading(false);
        setShowPopup(true);
      }
    }

    validateKey(apiKey);
  }, [searchParams]);

  function handleClose() {
    setShowPopup(false);
    if (!result?.valid) {
      router.push("/playground");
    }
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
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
          {/* Header */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Pages / Protected Area
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
              Protected Area
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              This area requires a valid API key to access.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <svg
                  className="h-10 w-10 animate-spin text-indigo-500"
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
                <p className="text-zinc-600 dark:text-zinc-400">
                  Validating your API key...
                </p>
              </div>
            </div>
          ) : result?.valid ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
                  <svg
                    className="h-6 w-6 text-emerald-600 dark:text-emerald-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                    Access Granted
                  </h2>
                  <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                    Your API key has been validated successfully.
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
                      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Key Name
                      </p>
                      <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                        {result.data?.label}
                      </p>
                    </div>
                    <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
                      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Key Type
                      </p>
                      <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            result.data?.type === "live"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          }`}
                        >
                          {result.data?.type === "live"
                            ? "Production"
                            : "Development"}
                        </span>
                      </p>
                    </div>
                    <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
                      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Usage
                      </p>
                      <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                        {result.data?.usage ?? 0}
                        {result.data?.limitMonthly && (
                          <span className="text-sm font-normal text-zinc-500">
                            {" "}
                            / {result.data.limitMonthly}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
                      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Status
                      </p>
                      <p className="mt-1 text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                        Active
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                <svg
                  className="h-8 w-8 text-red-600 dark:text-red-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Access Denied
              </h2>
              <p className="mt-2 text-center text-zinc-600 dark:text-zinc-400">
                {result?.error || "Invalid API key"}
              </p>
              <button
                onClick={() => router.push("/playground")}
                className="mt-6 flex h-11 items-center gap-2 rounded-full bg-zinc-900 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
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
                    d="M11 17l-5-5m0 0l5-5m-5 5h12"
                  />
                </svg>
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div
            className={`w-full max-w-sm rounded-2xl p-6 shadow-2xl ${
              result?.valid
                ? "bg-emerald-50 dark:bg-emerald-950"
                : "bg-red-50 dark:bg-red-950"
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full ${
                  result?.valid
                    ? "bg-emerald-100 dark:bg-emerald-900"
                    : "bg-red-100 dark:bg-red-900"
                }`}
              >
                {result?.valid ? (
                  <svg
                    className="h-8 w-8 text-emerald-600 dark:text-emerald-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-8 w-8 text-red-600 dark:text-red-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>

              <h3
                className={`mt-4 text-xl font-semibold ${
                  result?.valid
                    ? "text-emerald-900 dark:text-emerald-100"
                    : "text-red-900 dark:text-red-100"
                }`}
              >
                {result?.valid ? "API Key Valid!" : "API Key Invalid"}
              </h3>

              <p
                className={`mt-2 text-sm ${
                  result?.valid
                    ? "text-emerald-700 dark:text-emerald-300"
                    : "text-red-700 dark:text-red-300"
                }`}
              >
                {result?.valid
                  ? `Your key "${result.data?.label}" is active and ready to use.`
                  : result?.error || "The provided API key is not valid."}
              </p>

              <button
                onClick={handleClose}
                className={`mt-6 flex h-11 w-full items-center justify-center rounded-full text-sm font-semibold text-white transition ${
                  result?.valid
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {result?.valid ? "Continue" : "Try Again"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProtectedPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      }
    >
      <ProtectedContent />
    </Suspense>
  );
}

