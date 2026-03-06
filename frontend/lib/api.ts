const DEFAULT_API_ORIGIN = "http://localhost:8100";

function trimTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

export function getApiOrigin(): string {
  const envBase = process.env.NEXT_PUBLIC_API_BASE;
  if (envBase && envBase.trim().length > 0) {
    return trimTrailingSlash(envBase.trim());
  }
  return DEFAULT_API_ORIGIN;
}

export function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiOrigin()}${normalizedPath}`;
}
