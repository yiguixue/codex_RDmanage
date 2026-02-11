import type { DictItem } from "../types/domain";
import { httpDelete, httpGet, httpPost, httpPut } from "./http";

export function listDictItems() {
  return httpGet<DictItem[]>("/api/dicts");
}

export function createDictItem(payload: Partial<DictItem>) {
  return httpPost<DictItem>("/api/dicts", payload);
}

export function updateDictItem(id: number, payload: Partial<DictItem>) {
  return httpPut<DictItem>(`/api/dicts/${id}`, payload);
}

export function removeDictItem(id: number) {
  return httpDelete(`/api/dicts/${id}`);
}
