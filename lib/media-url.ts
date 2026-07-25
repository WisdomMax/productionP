const videoBaseUrl = process.env.NEXT_PUBLIC_VIDEO_BASE_URL?.replace(/\/+$/, "");

export function mediaUrl(path: string) {
  if (!videoBaseUrl || !path.startsWith("/videos/")) return path;
  return `${videoBaseUrl}${path}`;
}
