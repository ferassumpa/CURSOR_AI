/**
 * Gera uma chave API no formato tvly-dev-xxxx-xxxx-xxxx
 */
export function generateKey(): string {
  const head = Math.random().toString(36).slice(2, 6);
  const mid = Math.random().toString(36).slice(2, 6);
  const tail = Math.random().toString(36).slice(2, 6);
  return `tvly-dev-${head}-${mid}-${tail}`;
}

/**
 * Mascara uma chave API mostrando apenas os primeiros 8 caracteres
 */
export function maskKey(key: string): string {
  const visible = key.slice(0, 8);
  return `${visible}************************`;
}

/**
 * Combina classes CSS condicionalmente
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
