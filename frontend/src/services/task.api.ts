import type { TaskItem } from "../types/domain";
import { httpDelete, httpGet, httpPost, httpPut } from "./http";

export type TaskQuery = {
  productId?: number;
  moduleId?: number;
};

export function listTasks(query?: TaskQuery) {
  const params = new URLSearchParams();
  if (query?.productId != null) params.set("productId", String(query.productId));
  if (query?.moduleId != null) params.set("moduleId", String(query.moduleId));
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return httpGet<TaskItem[]>(`/api/tasks${suffix}`);
}

export function createTask(payload: Partial<TaskItem>) {
  return httpPost<TaskItem>("/api/tasks", payload);
}

export function updateTask(id: number, payload: Partial<TaskItem>) {
  return httpPut<TaskItem>(`/api/tasks/${id}`, payload);
}

export function removeTask(id: number) {
  return httpDelete(`/api/tasks/${id}`);
}
