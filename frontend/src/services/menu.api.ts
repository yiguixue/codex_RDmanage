import type { MenuItem } from "../types/domain";
import { httpGet, httpPut } from "./http";

export function loadMenuConfig() {
  return httpGet<MenuItem[]>("/api/menu-config");
}

export function saveMenuConfig(items: MenuItem[]) {
  return httpPut<void>("/api/menu-config", items);
}
