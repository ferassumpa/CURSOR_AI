import { NextResponse } from "next/server";

import { supabaseServer } from "@/lib/supabase-server";

type KeyType = "dev" | "live";

interface ApiKeyRow {
  id: string;
  label: string;
  key: string;
  type: KeyType;
  usage: number | null;
  status: "Active" | "Pending" | "Revoked";
  last_used: string | null;
  limit_monthly: number | null;
  created_at?: string;
}

function generateKey(type: KeyType): string {
  const head = Math.random().toString(36).slice(2, 6);
  const mid = Math.random().toString(36).slice(2, 6);
  const tail = Math.random().toString(36).slice(2, 6);
  return `tvly-${type}-${head}-${mid}-${tail}`;
}

function mapRow(row: ApiKeyRow) {
  return {
    id: row.id,
    label: row.label,
    key: row.key,
    type: row.type,
    usage: row.usage ?? 0,
    status: row.status,
    lastUsed: row.last_used ?? "Not used",
    limitMonthly: row.limit_monthly,
  };
}

export async function GET() {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("api_keys")
    .select(
      "id,label,key,type,usage,status,last_used,limit_monthly,created_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: (data ?? []).map(mapRow) });
}

export async function POST(request: Request) {
  const supabase = supabaseServer();
  const body = (await request.json()) as {
    label?: string;
    type?: KeyType;
    limitMonthly?: number | null;
  };

  const label = body.label?.trim();
  const type: KeyType = body.type === "live" ? "live" : "dev";
  const limitMonthly =
    typeof body.limitMonthly === "number" ? body.limitMonthly : null;

  if (!label) {
    return NextResponse.json({ error: "Label is required" }, { status: 400 });
  }

  const key = generateKey(type);
  const { data, error } = await supabase
    .from("api_keys")
    .insert({
      label,
      key,
      type,
      usage: 0,
      status: "Active",
      last_used: new Date().toISOString(),
      limit_monthly: limitMonthly,
    })
    .select(
      "id,label,key,type,usage,status,last_used,limit_monthly,created_at",
    )
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: mapRow(data as ApiKeyRow) });
}

export async function PATCH(request: Request) {
  const supabase = supabaseServer();
  const body = (await request.json()) as {
    id?: string;
    label?: string;
    status?: ApiKeyRow["status"];
    regenerate?: boolean;
  };

  if (!body.id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const { data: currentRow, error: fetchError } = await supabase
    .from("api_keys")
    .select("id,label,type")
    .eq("id", body.id)
    .single();

  if (fetchError || !currentRow) {
    return NextResponse.json(
      { error: fetchError?.message ?? "Not found" },
      { status: 404 },
    );
  }

  const updates: Partial<ApiKeyRow> = {};
  if (body.label) updates.label = body.label.trim();
  if (body.status) updates.status = body.status;
  if (body.regenerate) {
    updates.key = generateKey(currentRow.type as KeyType);
    updates.last_used = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("api_keys")
    .update(updates)
    .eq("id", body.id)
    .select(
      "id,label,key,type,usage,status,last_used,limit_monthly,created_at",
    )
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: mapRow(data as ApiKeyRow) });
}

export async function DELETE(request: Request) {
  const supabase = supabaseServer();
  const body = (await request.json()) as { id?: string };

  if (!body.id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const { error } = await supabase.from("api_keys").delete().eq("id", body.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

