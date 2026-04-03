export function isValidRemoteImageUrl(url?: string | null): boolean {
  if (!url) return false;
  const u = url.trim();
  if (u.length < 8) return false;
  if (u.startsWith("data:")) return true;
  if (!(u.startsWith("http://") || u.startsWith("https://"))) return false;
  return true;
}

