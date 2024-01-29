import { IVoter } from "@/pages/dpt";
import { formatUrl, getHeaders } from "./index.api";

const endpoint = "/voters";
export async function apiPostVoters(voters: IVoter[]) {
  try {
    const resp = await fetch(formatUrl(endpoint), {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ voters }),
    });

    const data = await resp.json();

    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function apiGetVoters({
  districtName,
  subdistrictName,
  votingPlaceNumber,
}: {
  districtName: string;
  subdistrictName: string;
  votingPlaceNumber: string;
}) {
  let url = formatUrl(endpoint);
  if (!!districtName || !!subdistrictName || !!votingPlaceNumber) {
    url += "?";
  }

  if (!!districtName) {
    url += `districtName=${districtName}&`;
  }
  if (!!subdistrictName) {
    url += `subdistrictName=${subdistrictName}&`;
  }
  if (!!votingPlaceNumber) {
    url += `votingPlaceNumber=${votingPlaceNumber}&`;
  }

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
