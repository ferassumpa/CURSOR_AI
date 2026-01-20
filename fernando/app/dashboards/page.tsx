"use client";

import { useState } from "react";
import { Sidebar } from "../components/sidebar";
import {
  PlanCard,
  ApiKeysSection,
  ApiKeyTable,
  CreateKeyModal,
  SuccessToast,
  CopiedToast,
} from "../components/dashboard";
import { useApiKeys } from "../hooks/use-api-keys";

export default function DashboardsPage() {
  const {
    keys,
    isLoading,
    error,
    isCreating,
    isMutatingId,
    fetchKeys,
    createKey,
    renameKey,
    revokeKey,
    activateKey,
    deleteKey,
    regenerateKey,
  } = useApiKeys();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  function showSuccessMessage(message: string) {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 2200);
  }

  async function handleCreate(data: {
    label: string;
    type: "dev" | "live";
    limitMonthly: number | null;
  }) {
    const success = await createKey(data);
    if (success) {
      setIsModalOpen(false);
      showSuccessMessage("API key created successfully!");
    }
  }

  async function handleRename(id: string) {
    const current = keys.find((item) => item.id === id);
    const nextLabel = window.prompt("New label", current?.label ?? "");
    if (!nextLabel) return;
    await renameKey(id, nextLabel.trim());
  }

  async function handleDelete(id: string) {
    await deleteKey(id);
    showSuccessMessage("API key deleted!");
  }

  async function handleCopy(id: string) {
    const current = keys.find((item) => item.id === id);
    if (!current) return;
    try {
      await navigator.clipboard.writeText(current.key);
      setCopiedLabel(current.label || "API key");
      setTimeout(() => {
        setCopiedLabel((value) => (value === current.label ? null : value));
      }, 2200);
    } catch {
      // ignore clipboard errors
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
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
          <PlanCard />

          <ApiKeysSection
            isLoading={isLoading}
            isCreating={isCreating}
            onRefresh={fetchKeys}
            onCreateNew={() => setIsModalOpen(true)}
          >
            <ApiKeyTable
              keys={keys}
              isLoading={isLoading}
              error={error}
              isMutatingId={isMutatingId}
              onRename={handleRename}
              onRevoke={revokeKey}
              onActivate={activateKey}
              onDelete={handleDelete}
              onRegenerate={regenerateKey}
              onCopy={handleCopy}
            />
          </ApiKeysSection>

          <CreateKeyModal
            isOpen={isModalOpen}
            isCreating={isCreating}
            onClose={() => setIsModalOpen(false)}
            onCreate={handleCreate}
          />

          <SuccessToast message={successMessage} />
          <CopiedToast label={copiedLabel} />
        </div>
      </div>
    </div>
  );
}
