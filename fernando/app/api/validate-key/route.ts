import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const body = (await request.json()) as { key?: string };

  if (!body.key || typeof body.key !== "string") {
    return NextResponse.json(
      { valid: false, error: "API key is required" },
      { status: 400 }
    );
  }

  const apiKey = body.key.trim();

  // Validar formato básico da key (tvly-dev-xxxx-xxxx-xxxx ou tvly-live-xxxx-xxxx-xxxx)
  const keyPattern = /^tvly-(dev|live)-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}$/;
  if (!keyPattern.test(apiKey)) {
    return NextResponse.json(
      { valid: false, error: "Invalid API key format" },
      { status: 400 }
    );
  }

  const supabase = supabaseServer();

  // Buscar a key no banco de dados
  const { data, error } = await supabase
    .from("api_keys")
    .select("id, label, type, status, usage, limit_monthly")
    .eq("key", apiKey)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { valid: false, error: "API key not found" },
      { status: 404 }
    );
  }

  // Verificar se a key está ativa
  if (data.status !== "Active") {
    return NextResponse.json(
      { valid: false, error: `API key is ${data.status.toLowerCase()}` },
      { status: 403 }
    );
  }

  // Verificar limite mensal se existir
  if (data.limit_monthly && data.usage >= data.limit_monthly) {
    return NextResponse.json(
      { valid: false, error: "Monthly usage limit exceeded" },
      { status: 429 }
    );
  }

  // Atualizar last_used e incrementar usage
  await supabase
    .from("api_keys")
    .update({
      last_used: new Date().toISOString(),
      usage: (data.usage ?? 0) + 1,
    })
    .eq("id", data.id);

  return NextResponse.json({
    valid: true,
    data: {
      label: data.label,
      type: data.type,
      usage: (data.usage ?? 0) + 1,
      limitMonthly: data.limit_monthly,
    },
  });
}

