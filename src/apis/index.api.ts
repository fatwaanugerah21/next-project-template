export const backendUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8085";

export function getHeaders() {
  return {
    "Content-Type": "application/json",
  };
}

export function formatUrl(endpoint: string) {
  return `${backendUrl}${endpoint}`;
}
