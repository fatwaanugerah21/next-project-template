import { TSubdistricts } from "@/pages/dpt";
import { formatUrl, getHeaders } from "./index.api";

const endpoint = "/subdistricts";
export async function apiPostSubdistricts(subDistricts: TSubdistricts) {
  const resp = await fetch(formatUrl(endpoint), {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(subDistricts),
  });

  const data = await resp.json();

  return data;
}

export async function apiGetSubdistricts(districtName?: string) {
  let url = formatUrl(endpoint);
  if (!!districtName) {
    url += `?districtName=${districtName}`;
  }

  const resp = await fetch(url, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await resp.json();

  return data;
}
