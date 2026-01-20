"use client";

import { useState, useEffect, useCallback } from "react";
import type { ApiKey, CreateKeyPayload } from "../types/api-key";

interface UseApiKeysReturn {
  keys: ApiKey[];
  isLoading: boolean;
  error: string | null;
  isCreating: boolean;
  isMutatingId: string | null;
  fetchKeys: () => Promise<void>;
  createKey: (payload: CreateKeyPayload) => Promise<boolean>;
  renameKey: (id: string, newLabel: string) => Promise<void>;
  revokeKey: (id: string) => Promise<void>;
  activateKey: (id: string) => Promise<void>;
  deleteKey: (id: string) => Promise<void>;
  regenerateKey: (id: string) => Promise<void>;
  clearError: () => void;
}

export function useApiKeys(): UseApiKeysReturn {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isMutatingId, setIsMutatingId] = useState<string | null>(null);

  const fetchKeys = useCallback(async () => {
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
  }, []);

  const createKey = useCallback(async (payload: CreateKeyPayload): Promise<boolean> => {
    setIsCreating(true);
    try {
      const response = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to create key");
      await fetchKeys();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create key");
      return false;
    } finally {
      setIsCreating(false);
    }
  }, [fetchKeys]);

  const renameKey = useCallback(async (id: string, newLabel: string) => {
    setIsMutatingId(id);
    try {
      const response = await fetch("/api/keys", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, label: newLabel }),
      });
      if (!response.ok) throw new Error("Failed to rename key");
      await fetchKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to rename key");
    } finally {
      setIsMutatingId(null);
    }
  }, [fetchKeys]);

  const revokeKey = useCallback(async (id: string) => {
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
  }, [fetchKeys]);

  const activateKey = useCallback(async (id: string) => {
    setIsMutatingId(id);
    try {
      const response = await fetch("/api/keys", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "Active" }),
      });
      if (!response.ok) throw new Error("Failed to activate key");
      await fetchKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to activate key");
    } finally {
      setIsMutatingId(null);
    }
  }, [fetchKeys]);

  const deleteKey = useCallback(async (id: string) => {
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
  }, [fetchKeys]);

  const regenerateKey = useCallback(async (id: string) => {
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
  }, [fetchKeys]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  return {
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
    clearError,
  };
}
