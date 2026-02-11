import type { Requirement } from "../types/domain";
import { httpDelete, httpGet, httpPost, httpPut } from "./http";

export type RequirementQuery = {
  productId?: number;
  moduleId?: number;
};

export function listRequirements(query?: RequirementQuery) {
  const params = new URLSearchParams();
  if (query?.productId != null) params.set("productId", String(query.productId));
  if (query?.moduleId != null) params.set("moduleId", String(query.moduleId));
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return httpGet<Requirement[]>(`/api/requirements${suffix}`);
}

export function createRequirement(payload: Partial<Requirement>) {
  return httpPost<Requirement>("/api/requirements", payload);
}

export function updateRequirement(id: number, payload: Partial<Requirement>) {
  return httpPut<Requirement>(`/api/requirements/${id}`, payload);
}

export function removeRequirement(id: number) {
  return httpDelete(`/api/requirements/${id}`);
}
