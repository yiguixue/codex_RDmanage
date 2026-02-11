import type { Version } from "../types/domain";
import { httpDelete, httpGet, httpPost, httpPut } from "./http";

export type VersionQuery = {
  productId?: number;
  moduleId?: number;
};

export function listVersions(query?: VersionQuery) {
  const params = new URLSearchParams();
  if (query?.productId != null) params.set("productId", String(query.productId));
  if (query?.moduleId != null) params.set("moduleId", String(query.moduleId));
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return httpGet<Version[]>(`/api/versions${suffix}`);
}

export function createVersion(payload: Partial<Version>) {
  return httpPost<Version>("/api/versions", payload);
}

export function updateVersion(id: number, payload: Partial<Version>) {
  return httpPut<Version>(`/api/versions/${id}`, payload);
}

export function removeVersion(id: number) {
  return httpDelete(`/api/versions/${id}`);
}
