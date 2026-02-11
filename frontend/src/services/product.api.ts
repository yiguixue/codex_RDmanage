import type { Product } from "../types/domain";
import { httpDelete, httpGet, httpPost, httpPut } from "./http";

export function listProducts() {
  return httpGet<Product[]>("/api/products");
}

export function createProduct(payload: Partial<Product>) {
  return httpPost<Product>("/api/products", payload);
}

export function updateProduct(id: number, payload: Partial<Product>) {
  return httpPut<Product>(`/api/products/${id}`, payload);
}

export function removeProduct(id: number) {
  return httpDelete(`/api/products/${id}`);
}
