import { formatUrl, getHeaders } from "./index.api";

const endpoint = "/responsibler-voters";

export async function apiCreateResponsiblerVoter({ responsiblerId, voterId }: { responsiblerId: number; voterId: number }) {
  const resp = await fetch(formatUrl(endpoint), {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      responsiblerId,
      voterId,
    }),
  });

  const data = await resp.json();

  return data;
}

export async function apiGetInputtedResponsiblerVotersDistrictAndSubdistrict() {
  try {
    let url = `${formatUrl(endpoint)}/inputted-district-and-subdistrict`;

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

export async function apiGetTotalResponsiblerVoters() {
  try {
    let url = `${formatUrl(endpoint)}/total`;

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

export async function apiGetTotalResponsiblerVotersPerSubdistrict(subdistrictName: string) {
  try {
    let url = `${formatUrl(endpoint)}/total/${subdistrictName}`;

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

export async function apiGetResponsiblerVoters(params: { responsiblerId: number }) {
  try {
    if (!params.responsiblerId) throw "";

    let url = `${formatUrl(endpoint)}?responsiblerId=${params.responsiblerId}`;

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

export async function apiDeleteResponsiblerVoters(rvId: number) {
  try {
    let url = `${formatUrl(endpoint)}/${rvId}`;

    const resp = await fetch(url, {
      method: "DELETE",
      headers: getHeaders(),
    });

    const data = await resp.json();

    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function apiGetResponsiblerVotersDuplicate(subdistrictName?: string) {
  try {
    let url = `${formatUrl(endpoint)}/all-duplicate?subdistrictName=${subdistrictName || ""}`;

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
