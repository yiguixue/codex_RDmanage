export type Version = {
  id?: number;
  productId?: number;
  moduleId?: number;
  versionCode: string;
  name: string;
  owner: string;
  planReleaseDate: string;
  status: string;
  description?: string;
  actualReleaseDate?: string;
};

export type Requirement = {
  id?: number;
  productId?: number;
  moduleId?: number;
  code: string;
  name: string;
  description?: string;
  priority: string;
  status: string;
  versionId: number;
  owner: string;
  dueDate?: string;
  estimateStoryPoints?: number;
};

export type TaskItem = {
  id?: number;
  productId?: number;
  moduleId?: number;
  requirementId: number;
  title: string;
  description?: string;
  assignee: string;
  status: string;
  dueDate?: string;
  estimateHours?: number;
};

export type DictItem = {
  id?: number;
  dictType: string;
  dictCode: string;
  dictLabel: string;
  sortOrder: number;
  isActive: number;
  remark?: string;
};

export type Product = {
  id?: number;
  code: string;
  name: string;
  owner: string;
  status: string;
  description?: string;
};

export type ProductModule = {
  id?: number;
  productId: number;
  parentId?: number;
  level: number;
  code: string;
  name: string;
  owner?: string;
  status: string;
  description?: string;
  sortOrder?: number;
};

export type MenuKey =
  | "overview"
  | "products"
  | "modules"
  | "versions"
  | "requirements"
  | "tasks"
  | "reports"
  | "dicts"
  | "settings"
  | "menus";

export type MenuNodeKey = MenuKey | "system" | "productGroup";

export type MenuItem = {
  key: MenuNodeKey;
  label: string;
  title: string;
  iconKey?: string;
  iconDataUrl?: string;
  children?: MenuItem[];
};
