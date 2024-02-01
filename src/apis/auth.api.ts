import { IVoter } from "@/pages/dpt";
import { formatUrl, getHeaders } from "./index.api";

const endpoint = "/passwords";
export async function apiUpdatePassword(password: string) {
  try {
    const resp = await fetch(`${formatUrl(endpoint)}?password=${password}`, {
      method: "PUT",
      headers: getHeaders(),
    });

    const data = await resp.json();

    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function apiGetPassword() {
  let url = formatUrl(endpoint);

  try {
    const resp = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });

    const data = await resp.json();

    return data;
  } catch (error) {
    console.error(error);
  }
}
