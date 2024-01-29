import { TNamed } from "@/pages/dpt";
import { getHeaders, formatUrl } from "./index.api";

const endpoint = "/districts";
export async function apiPostDistricts(districts: TNamed[]) {
  const resp = await fetch(formatUrl(endpoint), {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(districts),
  });

  const data = await resp.json();

  return data;
}

export async function apiGetDistricts() {
  const resp = await fetch(formatUrl(endpoint), {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await resp.json();

  return data;
}
