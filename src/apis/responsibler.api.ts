import { TNamed } from "@/pages/dpt";
import { getHeaders, formatUrl } from "./index.api";
import { TResponsibler } from "@/pages/coordinators";

const endpoint = "/responsiblers";
export async function apiPostResponsibler(responsibler: TResponsibler) {
  const resp = await fetch(`${formatUrl(endpoint)}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ responsibler }),
  });

  const data = await resp.json();

  console.log("Data responsiblers response: ", data);
  return data;
}

export async function apiPostResponsiblers(responsiblers: TResponsibler[]) {
  const resp = await fetch(`${formatUrl(endpoint)}/all`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ responsiblers }),
  });

  const data = await resp.json();

  console.log("Data responsiblers response: ", data);
  return data;
}

export async function apiGetResponsiblers({
  districtName,
  subdistrictName,
  votingPlaceNumber,
}: {
  districtName: string;
  subdistrictName: string;
  votingPlaceNumber?: string;
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

  console.log("Fetching responsiblers: ", url);

  const resp = await fetch(url, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await resp.json();

  return data;
}

export async function apiGetResponsiblersWithVoters({
  districtName,
  subdistrictName,
}: {
  districtName: string;
  subdistrictName: string;
  votingPlaceNumber?: string;
}) {
  let url = `${formatUrl(endpoint)}/with-voters`;

  if (!!districtName) {
    url += "?";
  }

  if (!!districtName) {
    url += `districtName=${districtName}&`;
  }
  if (!!subdistrictName) {
    url += `subdistrictName=${subdistrictName}&`;
  }

  const resp = await fetch(url, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await resp.json();

  return data;
}

export async function apiGetDetailResponsibler(id: number) {
  const resp = await fetch(formatUrl(`${endpoint}/${id}`), {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await resp.json();

  return data;
}

export async function apiDeleteAllResponsiblers() {
  const resp = await fetch(formatUrl(`${endpoint}/all`), {
    method: "DELETE",
    headers: getHeaders(),
  });

  const data = await resp.json();

  return data;
}

export async function apiDeleteResponsibler(id: number) {
  const url = formatUrl(`${endpoint}/${id}`);
  const resp = await fetch(url, {
    method: "DELETE",
    headers: getHeaders(),
  });

  const data = await resp.json();

  console.log("Data: ", data);

  return data;
}
