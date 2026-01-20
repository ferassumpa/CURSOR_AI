export interface ApiKey {
  id: string;
  label: string;
  key: string;
  type: "dev" | "live";
  usage: number;
  status: "Active" | "Pending" | "Revoked";
  lastUsed: string;
}

export interface CreateKeyPayload {
  label: string;
  type: "dev" | "live";
  limitMonthly: number | null;
}

export interface UpdateKeyPayload {
  id: string;
  label?: string;
  status?: "Revoked";
  regenerate?: boolean;
}

export interface DeleteKeyPayload {
  id: string;
}
