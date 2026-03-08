export function generateBaseSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function generateSlug(name: string): string {
  const base = generateBaseSlug(name)
  const suffix = Math.random().toString(36).substring(2, 8)
  return `${base}-${suffix}`
}
