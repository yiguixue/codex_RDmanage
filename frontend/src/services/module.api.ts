import type { ProductModule } from "../types/domain";
import { httpDelete, httpGet, httpPost, httpPut } from "./http";

export function listModules() {
  return httpGet<ProductModule[]>("/api/modules");
}

export function createModule(payload: Partial<ProductModule>) {
  return httpPost<ProductModule>("/api/modules", payload);
}

export function updateModule(id: number, payload: Partial<ProductModule>) {
  return httpPut<ProductModule>(`/api/modules/${id}`, payload);
}

export function removeModule(id: number) {
  return httpDelete(`/api/modules/${id}`);
}
