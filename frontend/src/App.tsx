
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  DictItem,
  Product,
  ProductModule,
  Requirement,
  TaskItem,
  Version
} from "./types/domain";
import {
  createVersion as createVersionApi,
  listVersions,
  removeVersion as removeVersionApi,
  updateVersion as updateVersionApi
} from "./services/version.api";
import {
  createRequirement as createRequirementApi,
  listRequirements,
  removeRequirement as removeRequirementApi,
  updateRequirement as updateRequirementApi
} from "./services/requirement.api";
import {
  createTask as createTaskApi,
  listTasks,
  removeTask as removeTaskApi,
  updateTask as updateTaskApi
} from "./services/task.api";
import {
  createDictItem as createDictItemApi,
  listDictItems,
  removeDictItem as removeDictItemApi,
  updateDictItem as updateDictItemApi
} from "./services/dict.api";
import {
  createProduct as createProductApi,
  listProducts,
  removeProduct as removeProductApi,
  updateProduct as updateProductApi
} from "./services/product.api";
import {
  createModule as createModuleApi,
  listModules,
  removeModule as removeModuleApi,
  updateModule as updateModuleApi
} from "./services/module.api";
import {
  loadMenuConfig as loadMenuConfigApi,
  saveMenuConfig as saveMenuConfigApi
} from "./services/menu.api";
import { VersionsPage } from "./pages/versions/VersionsPage";
import { OverviewPage } from "./pages/overview/OverviewPage";
import { ReportsPage } from "./pages/reports/ReportsPage";
import { ProductsPage } from "./pages/products/ProductsPage";
import { ModulesPage } from "./pages/modules/ModulesPage";
import { RequirementsPage } from "./pages/requirements/RequirementsPage";
import { TasksPage } from "./pages/tasks/TasksPage";
import { DictsPage } from "./pages/dicts/DictsPage";
import { SettingsPage } from "./pages/settings/SettingsPage";
import { MenusPage } from "./pages/menus/MenusPage";
import { AppShell } from "./app/AppShell";
import { pageMeta } from "./app/pageMeta";
import { PageHeader } from "./components/layout/PageHeader";
import type { SelectOption } from "./components/form/CustomSelect";
import { paginateItems } from "./components/data/Pagination";
import { MenuEditModal } from "./components/modal/MenuEditModal";
import { EntityFormModal } from "./components/modal/EntityFormModal";
import { DeleteConfirmModal } from "./components/modal/DeleteConfirmModal";
import { useListUiState } from "./app/useListUiState";
import { useDeleteConfirm } from "./app/useDeleteConfirm";

type MenuKey =
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

type MenuNodeKey = MenuKey | "system" | "productGroup";

type MenuItem = {
  key: MenuNodeKey;
  label: string;
  title: string;
  iconKey?: keyof typeof menuIcons;
  iconDataUrl?: string;
  children?: MenuItem[];
};

type ModalMode = "create" | "edit";

type ModalType = "product" | "module" | "version" | "requirement" | "task" | "dict" | null;

type ModalState = {
  type: ModalType;
  mode: ModalMode;
  data?: Version | Requirement | TaskItem | DictItem | Product | ProductModule;
};

type FilterState = {
  versionProduct: string;
  versionModule: string;
  versionStatus: string;
  versionOwner: string;
  versionDateStart: string;
  versionDateEnd: string;
  reqProduct: string;
  reqModule: string;
  reqPriority: string;
  reqVersion: string;
  reqOwner: string;
  taskProduct: string;
  taskModule: string;
  taskStatus: string;
  taskOwner: string;
  taskDue: string;
};

type ProductFilterState = {
  status: string;
  owner: string;
  keyword: string;
};

const initialMenus: MenuItem[] = [
  { key: "overview", label: "概览", title: "概览", iconKey: "overview" },
  {
    key: "productGroup",
    label: "产品管理",
    title: "产品管理",
    iconKey: "products",
    children: [
      { key: "products", label: "产品管理", title: "产品管理", iconKey: "products" },
      { key: "modules", label: "功能模块", title: "功能模块", iconKey: "modules" },
      { key: "versions", label: "版本管理", title: "版本管理", iconKey: "versions" }
    ]
  },
  { key: "requirements", label: "需求管理", title: "需求管理", iconKey: "requirements" },
  { key: "tasks", label: "任务管理", title: "任务管理", iconKey: "tasks" },
  { key: "reports", label: "数据报表", title: "数据报表", iconKey: "reports" },
  {
    key: "system",
    label: "系统管理",
    title: "系统管理",
    iconKey: "system",
    children: [
      { key: "dicts", label: "字典管理", title: "字典管理", iconKey: "dicts" },
      { key: "settings", label: "应用设置", title: "应用设置", iconKey: "settings" },
      { key: "menus", label: "菜单管理", title: "菜单管理", iconKey: "menus" }
    ]
  }
];

const emptyVersions: Version[] = [];
const emptyRequirements: Requirement[] = [];
const emptyTasks: TaskItem[] = [];

const emptyModal: ModalState = { type: null, mode: "create" };

const initialFilters: FilterState = {
  versionProduct: "全部",
  versionModule: "全部",
  versionStatus: "全部",
  versionOwner: "",
  versionDateStart: "",
  versionDateEnd: "",
  reqProduct: "全部",
  reqModule: "全部",
  reqPriority: "全部",
  reqVersion: "全部",
  reqOwner: "",
  taskProduct: "全部",
  taskModule: "全部",
  taskStatus: "全部",
  taskOwner: "",
  taskDue: ""
};

const initialProductFilters: ProductFilterState = {
  status: "全部",
  owner: "",
  keyword: ""
};

const IconCollapse = ({ collapsed }: { collapsed: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d={collapsed ? "M9 6l6 6-6 6" : "M15 6l-6 6 6 6"}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconOverview = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const IconProducts = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="4" y="4" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
    <rect x="13" y="4" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
    <rect x="4" y="13" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
    <rect x="13" y="13" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const IconModules = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 7h8M4 12h12M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="16" cy="12" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const IconVersions = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 4h14v4H5zM5 10h14v4H5zM5 16h14v4H5z" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const IconRequirements = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 4h10l3 3v13H7z" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M9 10h6M9 14h6M9 18h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IconTasks = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="4" y="5" width="16" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M8 12l2.5 2.5L16 9" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconReports = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 19V5M10 19V9M16 19V13M22 19V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IconSystem = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M4 12h2.2M17.8 12H20M12 4v2.2M12 17.8V20M6.3 6.3l1.6 1.6M16.1 16.1l1.6 1.6M17.7 6.3l-1.6 1.6M7.9 16.1l-1.6 1.6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const IconDict = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 6h10v12H4z" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M14 6h6v12h-6z" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M7 9h4M7 12h4M7 15h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IconSettings = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M7 9h10M7 12.5h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="17" cy="12.5" r="1.5" fill="currentColor" />
  </svg>
);

const IconMenuManage = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="18" cy="18" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const IconGrip = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="8" cy="7" r="1.5" fill="currentColor" />
    <circle cx="16" cy="7" r="1.5" fill="currentColor" />
    <circle cx="8" cy="12" r="1.5" fill="currentColor" />
    <circle cx="16" cy="12" r="1.5" fill="currentColor" />
    <circle cx="8" cy="17" r="1.5" fill="currentColor" />
    <circle cx="16" cy="17" r="1.5" fill="currentColor" />
  </svg>
);

const IconChevron = ({ open }: { open: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    aria-hidden="true"
    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
  >
    <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M7 7l10 10M17 7l-10 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const iconLibrary = [
  { name: "仪表盘", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M4 13a8 8 0 1 1 16 0'/><path d='M12 13l4-4'/><path d='M4 13h16'/></svg>" },
  { name: "应用", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='4' y='4' width='7' height='7'/><rect x='13' y='4' width='7' height='7'/><rect x='4' y='13' width='7' height='7'/><rect x='13' y='13' width='7' height='7'/></svg>" },
  { name: "列表", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M8 6h12M8 12h12M8 18h12'/><circle cx='4' cy='6' r='1.5'/><circle cx='4' cy='12' r='1.5'/><circle cx='4' cy='18' r='1.5'/></svg>" },
  { name: "表格", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='3' y='5' width='18' height='14' rx='2'/><path d='M3 10h18M3 15h18M9 5v14M15 5v14'/></svg>" },
  { name: "设置", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z'/><path d='M4 12h2.2M17.8 12H20M12 4v2.2M12 17.8V20M6.3 6.3l1.6 1.6M16.1 16.1l1.6 1.6M17.7 6.3l-1.6 1.6M7.9 16.1l-1.6 1.6'/></svg>" },
  { name: "用户", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='8' r='4'/><path d='M4 20c2-4 14-4 16 0'/></svg>" },
  { name: "成员", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='9' cy='8' r='3'/><circle cx='17' cy='9' r='2.5'/><path d='M3 20c1.8-3 8.2-3 10 0'/><path d='M14 20c.6-2 4.4-2 5 0'/></svg>" },
  { name: "通知", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M6 9a6 6 0 0 1 12 0v5l2 2H4l2-2z'/><path d='M9 18a3 3 0 0 0 6 0'/></svg>" },
  { name: "消息", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M4 5h16v10H7l-3 3z'/><path d='M8 9h8M8 12h6'/></svg>" },
  { name: "日历", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='3' y='5' width='18' height='16' rx='2'/><path d='M8 3v4M16 3v4M3 9h18'/></svg>" },
  { name: "时间", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='8'/><path d='M12 8v5l3 2'/></svg>" },
  { name: "进度", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='8'/><path d='M12 4a8 8 0 0 1 8 8'/></svg>" },
  { name: "数据", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M4 20V4'/><path d='M8 20V10'/><path d='M12 20V6'/><path d='M16 20V14'/><path d='M20 20V8'/></svg>" },
  { name: "趋势", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M4 16l5-5 4 4 7-7'/><path d='M20 7h-5v5'/></svg>" },
  { name: "目标", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='8'/><circle cx='12' cy='12' r='4'/><circle cx='12' cy='12' r='1'/></svg>" },
  { name: "星标", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M12 4l2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8z'/></svg>" },
  { name: "标签", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M4 7v6l7 7 9-9-7-7H4z'/><circle cx='7' cy='10' r='1.5'/></svg>" },
  { name: "定位", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='3'/><path d='M12 2v4M12 18v4M2 12h4M18 12h4'/></svg>" },
  { name: "地图", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z'/><path d='M9 4v14M15 6v14'/></svg>" },
  { name: "文档", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M7 4h8l4 4v12H7z'/><path d='M15 4v4h4'/></svg>" },
  { name: "任务", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='4' y='5' width='16' height='14' rx='2'/><path d='M8 12l2.5 2.5L16 9'/></svg>" },
  { name: "需求", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M7 4h10l3 3v13H7z'/><path d='M9 10h6M9 14h6M9 18h6'/></svg>" },
  { name: "版本", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M5 4h14v4H5zM5 10h14v4H5zM5 16h14v4H5z'/></svg>" },
  { name: "发布", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M12 3v12'/><path d='M7 8l5-5 5 5'/><path d='M5 21h14'/></svg>" },
  { name: "下载", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M12 3v12'/><path d='M7 10l5 5 5-5'/><path d='M5 21h14'/></svg>" },
  { name: "上传", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M12 21V9'/><path d='M7 14l5-5 5 5'/><path d='M5 3h14'/></svg>" },
  { name: "分享", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='18' cy='5' r='2'/><circle cx='6' cy='12' r='2'/><circle cx='18' cy='19' r='2'/><path d='M8 11l8-4M8 13l8 4'/></svg>" },
  { name: "权限", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M12 3l8 4v6c0 5-3 7-8 8-5-1-8-3-8-8V7z'/><path d='M9 12l2 2 4-4'/></svg>" },
  { name: "安全", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='5' y='10' width='14' height='10' rx='2'/><path d='M8 10V7a4 4 0 0 1 8 0v3'/></svg>" },
  { name: "锁", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='5' y='10' width='14' height='10' rx='2'/><path d='M8 10V7a4 4 0 0 1 8 0v3'/></svg>" },
  { name: "解锁", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='5' y='10' width='14' height='10' rx='2'/><path d='M9 10V7a3 3 0 0 1 6 0'/></svg>" },
  { name: "搜索", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='11' cy='11' r='6'/><path d='M20 20l-3.5-3.5'/></svg>" },
  { name: "筛选", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M4 6h16M7 12h10M10 18h4'/></svg>" },
  { name: "下载日志", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M6 4h9l3 3v13H6z'/><path d='M12 10v6'/><path d='M9 13l3 3 3-3'/></svg>" },
  { name: "日志", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M6 4h9l3 3v13H6z'/><path d='M8 11h8M8 15h8'/></svg>" },
  { name: "监控", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='3' y='4' width='18' height='16' rx='2'/><path d='M6 16l3-4 3 3 4-6 2 7'/></svg>" },
  { name: "服务器", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='4' y='4' width='16' height='6'/><rect x='4' y='14' width='16' height='6'/><path d='M8 7h0M8 17h0'/></svg>" },
  { name: "数据库", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><ellipse cx='12' cy='6' rx='7' ry='3'/><path d='M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6'/><path d='M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6'/></svg>" },
  { name: "API", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M4 8h6v8H4zM14 5h6v14h-6z'/></svg>" },
  { name: "接口", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M8 7l-4 5 4 5'/><path d='M16 7l4 5-4 5'/><path d='M10 19l4-14'/></svg>" },
  { name: "代码", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M8 7l-4 5 4 5'/><path d='M16 7l4 5-4 5'/></svg>" },
  { name: "合并", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='6' cy='6' r='2'/><circle cx='18' cy='18' r='2'/><circle cx='18' cy='6' r='2'/><path d='M8 6h6v10'/></svg>" },
  { name: "分支", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='6' cy='6' r='2'/><circle cx='6' cy='18' r='2'/><circle cx='18' cy='12' r='2'/><path d='M6 8v8'/><path d='M8 6h6a4 4 0 0 1 0 8H8'/></svg>" },
  { name: "流程", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='4' y='4' width='6' height='6'/><rect x='14' y='14' width='6' height='6'/><path d='M10 7h4v10'/></svg>" },
  { name: "审批", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='5' y='4' width='14' height='16' rx='2'/><path d='M9 8h6M9 12h6M9 16h4'/></svg>" },
  { name: "检查", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='9'/><path d='M8 12l2.5 2.5L16 9'/></svg>" },
  { name: "警告", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M12 4l9 16H3z'/><path d='M12 10v4M12 18h0'/></svg>" },
  { name: "风险", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M12 4l9 16H3z'/><path d='M12 10v4M12 18h0'/></svg>" },
  { name: "问题", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='9'/><path d='M9.5 9a2.5 2.5 0 0 1 5 1.2c0 1.8-2.5 2-2.5 4'/><circle cx='12' cy='17' r='1'/></svg>" },
  { name: "帮助", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='9'/><path d='M9.5 9a2.5 2.5 0 0 1 5 1.2c0 1.8-2.5 2-2.5 4'/><circle cx='12' cy='17' r='1'/></svg>" },
  { name: "收藏", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M6 3h12v18l-6-4-6 4z'/></svg>" },
  { name: "附件", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M8 12l6-6a3 3 0 0 1 4 4l-7 7a5 5 0 0 1-7-7l7-7'/></svg>" },
  { name: "打印", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M6 9V4h12v5'/><rect x='6' y='14' width='12' height='6'/><rect x='4' y='9' width='16' height='5'/></svg>" },
  { name: "导出", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M12 3v12'/><path d='M7 10l5 5 5-5'/><rect x='4' y='18' width='16' height='3'/></svg>" },
  { name: "导入", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M12 21V9'/><path d='M7 14l5-5 5 5'/><rect x='4' y='3' width='16' height='3'/></svg>" },
  { name: "看板", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='4' y='4' width='6' height='16'/><rect x='14' y='4' width='6' height='10'/></svg>" },
  { name: "分组", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='4' y='4' width='7' height='7'/><rect x='13' y='13' width='7' height='7'/><path d='M11 11l2 2'/></svg>" },
  { name: "成本", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='8'/><path d='M12 7v10M9 10h6M9 14h6'/></svg>" },
  { name: "预算", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='8'/><path d='M12 6v12M9 9h6M9 15h6'/></svg>" },
  { name: "报销", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='5' y='4' width='14' height='16' rx='2'/><path d='M8 9h8M8 13h6'/></svg>" },
  { name: "合同", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='5' y='4' width='14' height='16' rx='2'/><path d='M8 8h8M8 12h8M8 16h4'/></svg>" },
  { name: "仓库", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M3 9l9-5 9 5v11H3z'/><path d='M9 20V12h6v8'/></svg>" },
  { name: "资源", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M4 7h16M4 12h16M4 17h10'/></svg>" },
  { name: "资产", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='4' y='6' width='16' height='12' rx='2'/><path d='M8 6V4h8v2'/></svg>" },
  { name: "配置", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M12 8.5a3.5 3.5 0 1 0 0 7'/><path d='M4 12h2.2M17.8 12H20M12 4v2.2M12 17.8V20M6.3 6.3l1.6 1.6'/></svg>" },
  { name: "运营", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M4 19V5l8 6 8-6v14'/></svg>" },
  { name: "营销", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M3 11l9-4 9 4-9 4z'/><path d='M6 12v5l6 3 6-3v-5'/></svg>" },
  { name: "公告", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M4 10h10l4-4v12l-4-4H4z'/><path d='M4 10v4'/></svg>" },
  { name: "消息中心", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M4 6h16v10H7l-3 3z'/></svg>" },
  { name: "部门", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='4' y='4' width='7' height='7'/><rect x='13' y='4' width='7' height='7'/><rect x='9' y='13' width='7' height='7'/><path d='M7.5 11v2M16.5 11v2'/></svg>" },
  { name: "组织", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='6' cy='6' r='2'/><circle cx='18' cy='6' r='2'/><circle cx='12' cy='18' r='2'/><path d='M6 8v4l6 4 6-4V8'/></svg>" },
  { name: "角色", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='8' r='4'/><path d='M4 20c2-4 14-4 16 0'/><path d='M12 14v6'/></svg>" },
  { name: "权限组", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M12 3l8 4v6c0 5-3 7-8 8-5-1-8-3-8-8V7z'/></svg>" },
  { name: "项目", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='4' y='4' width='16' height='12' rx='2'/><path d='M8 20h8'/></svg>" },
  { name: "里程碑", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M6 20V6l6-2 6 2v14'/><path d='M6 12h12'/></svg>" },
  { name: "里程碑2", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M6 20V6l6-2 6 2v14'/><circle cx='12' cy='10' r='2'/></svg>" },
  { name: "看板视图", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='4' y='4' width='6' height='16'/><rect x='14' y='4' width='6' height='16'/></svg>" },
  { name: "成员管理", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='8' cy='8' r='3'/><circle cx='16' cy='10' r='2'/><path d='M3 20c1.8-3 8.2-3 10 0'/><path d='M13.5 20c.5-1.5 3.5-1.5 4 0'/></svg>" },
  { name: "发布管理", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M12 3v12'/><path d='M7 8l5-5 5 5'/><circle cx='12' cy='18' r='3'/></svg>" },
  { name: "审批流", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='4' y='4' width='6' height='6'/><rect x='14' y='14' width='6' height='6'/><path d='M10 7h4v10'/><circle cx='14' cy='7' r='2'/></svg>" },
  { name: "集成", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M9 3H4v5M15 21h5v-5M4 8l6 6M14 14l6 6'/></svg>" },
  { name: "工时", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='8'/><path d='M12 8v5l3 2'/><path d='M8 3h8'/></svg>" },
  { name: "排期", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='3' y='5' width='18' height='16' rx='2'/><path d='M8 3v4M16 3v4M3 9h18'/><path d='M7 13h4'/></svg>" },
  { name: "工单", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M7 4h10l3 3v13H7z'/><path d='M9 11h6M9 15h6'/></svg>" },
  { name: "知识库", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M4 5h9a3 3 0 0 1 3 3v11H7a3 3 0 0 0-3 3z'/><path d='M14 5h6v13h-6'/></svg>" },
  { name: "资产库", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='4' y='4' width='16' height='16' rx='2'/><path d='M8 8h8M8 12h8M8 16h5'/></svg>" },
  { name: "反馈", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M4 6h16v10H7l-3 3z'/><path d='M8 9h8M8 12h6'/></svg>" },
  { name: "评分", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M12 4l2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8z'/></svg>" },
  { name: "仓储", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M3 9l9-5 9 5v11H3z'/><path d='M9 20V12h6v8'/></svg>" },
  { name: "盘点", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='4' y='4' width='16' height='16' rx='2'/><path d='M8 8h8M8 12h8M8 16h4'/></svg>" },
  { name: "归档", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='4' y='4' width='16' height='6'/><rect x='5' y='10' width='14' height='10'/><path d='M9 14h6'/></svg>" },
  { name: "回收站", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M4 7h16'/><path d='M9 7V4h6v3'/><rect x='6' y='7' width='12' height='13' rx='2'/><path d='M10 11v6M14 11v6'/></svg>" },
  { name: "收藏夹", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M6 3h12v18l-6-4-6 4z'/></svg>" },
  { name: "固定", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M8 3l8 8-4 4-8-8z'/><path d='M9 13l-4 4'/></svg>" },
  { name: "书签", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M6 3h12v18l-6-4-6 4z'/></svg>" },
  { name: "对话", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M4 6h16v10H7l-3 3z'/></svg>" },
  { name: "命名", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M4 7h16M4 12h10M4 17h6'/></svg>" },
  { name: "切换", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M7 7h10l-3-3M17 17H7l3 3'/></svg>" },
  { name: "刷新", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M4 12a8 8 0 1 0 2.3-5.7'/><path d='M4 4v5h5'/></svg>" },
  { name: "同步", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M7 7h10l-3-3M17 17H7l3 3'/></svg>" },
  { name: "构建", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M3 12h18'/><path d='M6 6l6 12 6-12'/></svg>" },
  { name: "发布计划", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='3' y='5' width='18' height='16' rx='2'/><path d='M8 3v4M16 3v4M3 9h18'/><path d='M7 13h4M7 16h4'/></svg>" },
  { name: "里程", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M4 18l6-6 4 4 6-6'/><path d='M20 6h-5v5'/></svg>" },
  { name: "风险评估", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M12 4l9 16H3z'/><path d='M12 10v4M12 18h0'/></svg>" },
  { name: "需求池", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='4' y='5' width='16' height='14' rx='2'/><path d='M8 9h8M8 13h8M8 17h6'/></svg>" },
  { name: "工时表", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='3' y='5' width='18' height='14' rx='2'/><path d='M7 9h4M7 13h4M13 9h4M13 13h4'/></svg>" },
  { name: "BI", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M4 20V8'/><path d='M9 20V4'/><path d='M14 20v-6'/><path d='M19 20v-10'/></svg>" },
  { name: "统计", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M4 20V8'/><path d='M10 20V4'/><path d='M16 20v-6'/></svg>" },
  { name: "性能", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M4 14a8 8 0 1 1 16 0'/><path d='M12 14l4-4'/></svg>" },
  { name: "优化", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M6 12h12'/><path d='M12 6v12'/></svg>" },
  { name: "问题单", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='5' y='4' width='14' height='16' rx='2'/><path d='M8 10h8M8 14h6'/></svg>" },
  { name: "服务台", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M4 12h16'/><path d='M7 12V9a5 5 0 0 1 10 0v3'/><path d='M7 16h10'/></svg>" },
  { name: "我的", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='8' r='4'/><path d='M4 20c2-4 14-4 16 0'/></svg>" },
  { name: "收藏2", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M12 4l2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8z'/></svg>" },
  { name: "设置2", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M12 8.5a3.5 3.5 0 1 0 0 7'/><path d='M4 12h2.2M17.8 12H20M12 4v2.2M12 17.8V20'/></svg>" },
  { name: "外链", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M14 4h6v6'/><path d='M10 14l10-10'/><path d='M20 14v6H4V4h6'/></svg>" },
  { name: "批量", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='4' y='4' width='8' height='8'/><rect x='12' y='12' width='8' height='8'/></svg>" },
  { name: "链接", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M10 14l-2 2a3 3 0 0 1-4-4l2-2'/><path d='M14 10l2-2a3 3 0 0 1 4 4l-2 2'/><path d='M8 12h8'/></svg>" },
  { name: "公告2", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M4 10h10l4-4v12l-4-4H4z'/></svg>" },
  { name: "操作", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='5' cy='12' r='2'/><circle cx='12' cy='12' r='2'/><circle cx='19' cy='12' r='2'/></svg>" },
  { name: "更多", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='5' cy='12' r='2'/><circle cx='12' cy='12' r='2'/><circle cx='19' cy='12' r='2'/></svg>" },
  { name: "筛选器", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M4 6h16M7 12h10M10 18h4'/></svg>" },
  { name: "导航", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M12 3l9 18-9-4-9 4z'/></svg>" },
  { name: "指北针", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='8'/><path d='M12 8l4 4-4 4-4-4z'/></svg>" },
  { name: "工具", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M14 7l3 3-7 7-3-3z'/><path d='M5 19l4-4'/></svg>" },
  { name: "配置项", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='4' y='4' width='7' height='7'/><rect x='13' y='13' width='7' height='7'/><path d='M11 11l2 2'/></svg>" },
  { name: "评审", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='4' y='4' width='16' height='12' rx='2'/><path d='M8 10h8M8 14h5'/></svg>" },
  { name: "组件", svg: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='4' y='4' width='6' height='6'/><rect x='14' y='4' width='6' height='6'/><rect x='9' y='14' width='6' height='6'/></svg>" }
];

const normalizeSvg = (svg: string) => {
  const withXmlns = svg.includes("xmlns=")
    ? svg
    : svg.replace("<svg", "<svg xmlns='http://www.w3.org/2000/svg'");
  return withXmlns.replace(/\s+/g, " ").trim();
};

const svgToDataUrl = (svg: string) => {
  const normalized = normalizeSvg(svg);
  const encoded = btoa(unescape(encodeURIComponent(normalized)));
  return `data:image/svg+xml;base64,${encoded}`;
};

const iconLibraryOptions = iconLibrary.map((item) => ({
  name: item.name,
  dataUrl: svgToDataUrl(item.svg)
}));

const normalizeMenuConfig = (items: MenuItem[]) =>
  items.map((item) => {
    if (item.children && item.children.length > 0) {
      const hasDuplicateKey = item.children.some((child) => child.key === item.key);
      if (hasDuplicateKey) {
        const normalizedKey = item.key === "products" ? "productGroup" : item.key;
        return { ...item, key: normalizedKey };
      }
    }
    return item;
  });

const mergeMenuConfig = (defaults: MenuItem[], remote: MenuItem[]) => {
  const defaultByKey = new Map(defaults.map((item) => [item.key, item]));
  const merged: MenuItem[] = [];

  remote.forEach((item) => {
    const def = defaultByKey.get(item.key);
    if (def && def.children && def.children.length > 0) {
      const remoteChildren = item.children ?? [];
      const childKeys = new Set(remoteChildren.map((child) => child.key));
      const mergedChildren = [
        ...remoteChildren,
        ...def.children.filter((child) => !childKeys.has(child.key))
      ];
      merged.push({ ...def, ...item, children: mergedChildren });
      return;
    }
    if (def) {
      merged.push({ ...def, ...item, children: item.children ?? def.children });
      return;
    }
    merged.push(item);
  });

  const mergedKeys = new Set(merged.map((item) => item.key));
  defaults.forEach((def) => {
    if (!mergedKeys.has(def.key)) {
      merged.push(def);
    }
  });

  return merged;
};

const menuIcons: Record<MenuNodeKey | "menus", JSX.Element> = {
  overview: <IconOverview />,
  products: <IconProducts />,
  modules: <IconModules />,
  versions: <IconVersions />,
  requirements: <IconRequirements />,
  tasks: <IconTasks />,
  reports: <IconReports />,
  dicts: <IconDict />,
  settings: <IconSettings />,
  system: <IconSystem />,
  productGroup: <IconProducts />,
  menus: <IconMenuManage />
};
export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [modules, setModules] = useState<ProductModule[]>([]);
  const [versions, setVersions] = useState<Version[]>(emptyVersions);
  const [requirements, setRequirements] = useState<Requirement[]>(emptyRequirements);
  const [tasks, setTasks] = useState<TaskItem[]>(emptyTasks);
  const [dictItems, setDictItems] = useState<DictItem[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingModules, setLoadingModules] = useState(false);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [loadingRequirements, setLoadingRequirements] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [loadingDicts, setLoadingDicts] = useState(false);
  const [productError, setProductError] = useState("");
  const [moduleError, setModuleError] = useState("");
  const [versionError, setVersionError] = useState("");
  const [requirementError, setRequirementError] = useState("");
  const [taskError, setTaskError] = useState("");
  const [dictError, setDictError] = useState("");
  const [activeMenu, setActiveMenu] = useState<MenuKey>("overview");
  const [productExpanded, setProductExpanded] = useState(true);
  const [systemExpanded, setSystemExpanded] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [modal, setModal] = useState<ModalState>(emptyModal);
  const {
    viewMode,
    pagination,
    setPagination,
    filters,
    setFilters,
    appliedFilters,
    setAppliedFilters,
    productFilters,
    setProductFilters,
    appliedProductFilters,
    setAppliedProductFilters,
    selectedVersionId,
    setSelectedVersionId,
    selectedModuleProductId,
    setSelectedModuleProductId,
    moduleLevelFilter,
    setModuleLevelFilter,
    moduleStatusFilter,
    setModuleStatusFilter,
    toggleViewMode,
    handleFilterSubmit,
    handleProductFilterSubmit,
    handleModuleFilterSubmit
  } = useListUiState(initialFilters, initialProductFilters);
  const [appName, setAppName] = useState("研发管理系统");
  const [appIcon, setAppIcon] = useState<string | null>(null);
  const [productHover, setProductHover] = useState(false);
  const [systemHover, setSystemHover] = useState(false);
  const [menuConfig, setMenuConfig] = useState<MenuItem[]>(initialMenus);
  const [draggingMenu, setDraggingMenu] = useState<{
    key: MenuNodeKey;
    parentKey?: MenuNodeKey;
  } | null>(null);
  const [dragOverMenu, setDragOverMenu] = useState<MenuNodeKey | null>(null);
  const saveMenuTimer = useRef<number | null>(null);
  const [menuEditTarget, setMenuEditTarget] = useState<{
    key: MenuNodeKey;
    parentKey?: MenuNodeKey;
    label: string;
    iconDataUrl?: string;
    iconKey?: keyof typeof menuIcons;
    svgText?: string;
  } | null>(null);
  const [iconLibraryOpen, setIconLibraryOpen] = useState(false);
  const [iconLibraryQuery, setIconLibraryQuery] = useState("");
  const {
    deleteConfirm,
    deleteSubmitting,
    requestDelete,
    closeDeleteConfirm,
    confirmDelete
  } = useDeleteConfirm({
    product: async (id) => {
      await removeProductApi(id);
      setProducts((prev) => prev.filter((item) => item.id !== id));
    },
    module: async (id) => {
      await removeModuleApi(id);
      setModules((prev) => prev.filter((item) => item.id !== id));
    },
    version: async (id) => {
      await removeVersionApi(id);
      setVersions((prev) => prev.filter((item) => item.id !== id));
    },
    requirement: async (id) => {
      await removeRequirementApi(id);
      setRequirements((prev) => prev.filter((item) => item.id !== id));
    },
    task: async (id) => {
      await removeTaskApi(id);
      setTasks((prev) => prev.filter((item) => item.id !== id));
    },
    dict: async (id) => {
      await removeDictItemApi(id);
      setDictItems((prev) => prev.filter((item) => item.id !== id));
    }
  });

  useEffect(() => {
    const storedName = localStorage.getItem("rd_app_name");
    const storedIcon = localStorage.getItem("rd_app_icon");
    if (storedName) {
      setAppName(storedName);
    }
    if (storedIcon) {
      setAppIcon(storedIcon);
    }
  }, []);

  useEffect(() => {
    loadMenuConfigApi()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setMenuConfig(mergeMenuConfig(initialMenus, normalizeMenuConfig(data)));
        }
      })
      .catch(() => null);
  }, []);

  useEffect(() => {
    localStorage.setItem("rd_app_name", appName);
  }, [appName]);

  useEffect(() => {
    if (appIcon) {
      localStorage.setItem("rd_app_icon", appIcon);
    } else {
      localStorage.removeItem("rd_app_icon");
    }
  }, [appIcon]);

  useEffect(() => {
    let active = true;
    setLoadingProducts(true);
    listProducts()
      .then((data: Product[]) => {
        if (!active) return;
        if (Array.isArray(data)) {
          setProducts(data);
        }
      })
      .catch((err) => {
        if (!active) return;
        setProductError(`产品接口不可用 (${err.message})`);
      })
      .finally(() => {
        if (!active) return;
        setLoadingProducts(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setLoadingModules(true);
    listModules()
      .then((data: ProductModule[]) => {
        if (!active) return;
        if (Array.isArray(data)) {
          setModules(data);
        }
      })
      .catch((err) => {
        if (!active) return;
        setModuleError(`功能模块接口不可用 (${err.message})`);
      })
      .finally(() => {
        if (!active) return;
        setLoadingModules(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const flatMenus = useMemo(() => {
    const items: MenuItem[] = [];
    menuConfig.forEach((menu) => {
      if (menu.children && menu.children.length > 0) {
        menu.children.forEach((child) => items.push(child));
      } else if (menu.key !== "system") {
        items.push(menu);
      }
    });
    return items;
  }, [menuConfig]);

  const productMenuGroup = useMemo(
    () => menuConfig.find((menu) => menu.key === "productGroup"),
    [menuConfig]
  );
  const systemMenuGroup = useMemo(() => menuConfig.find((menu) => menu.key === "system"), [menuConfig]);

  const productMenus = productMenuGroup?.children ?? [];
  const systemMenus = systemMenuGroup?.children ?? [];

  useEffect(() => {
    const current = flatMenus.find((menu) => menu.key === activeMenu);
    document.title = current ? current.title : "概览";
  }, [activeMenu, flatMenus]);

  useEffect(() => {
    if (!sidebarCollapsed && productMenus.some((menu) => menu.key === activeMenu)) {
      setProductExpanded(true);
    }
  }, [activeMenu, sidebarCollapsed, productMenus]);

  useEffect(() => {
    if (!sidebarCollapsed && systemMenus.some((menu) => menu.key === activeMenu)) {
      setSystemExpanded(true);
    }
  }, [activeMenu, sidebarCollapsed, systemMenus]);

  useEffect(() => {
    let active = true;
    setLoadingVersions(true);
    listVersions()
      .then((data: Version[]) => {
        if (!active) return;
        if (Array.isArray(data)) {
          setVersions(data);
        }
      })
      .catch((err) => {
        if (!active) return;
        setVersionError(`版本接口不可用 (${err.message})`);
      })
      .finally(() => {
        if (!active) return;
        setLoadingVersions(false);
      });

    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    let active = true;
    setLoadingRequirements(true);
    listRequirements()
      .then((data: Requirement[]) => {
        if (!active) return;
        if (Array.isArray(data)) {
          setRequirements(data);
        }
      })
      .catch((err) => {
        if (!active) return;
        setRequirementError(`需求接口不可用 (${err.message})`);
      })
      .finally(() => {
        if (!active) return;
        setLoadingRequirements(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setLoadingTasks(true);
    listTasks()
      .then((data: TaskItem[]) => {
        if (!active) return;
        if (Array.isArray(data)) {
          setTasks(data);
        }
      })
      .catch((err) => {
        if (!active) return;
        setTaskError(`任务接口不可用 (${err.message})`);
      })
      .finally(() => {
        if (!active) return;
        setLoadingTasks(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setLoadingDicts(true);
    listDictItems()
      .then((data: DictItem[]) => {
        if (!active) return;
        if (Array.isArray(data)) {
          setDictItems(data);
        }
      })
      .catch((err) => {
        if (!active) return;
        setDictError(`字典接口不可用 (${err.message})`);
      })
      .finally(() => {
        if (!active) return;
        setLoadingDicts(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const versionStats = useMemo(() => {
    const highPriorityCount = requirements.filter((item) =>
      ["HIGH", "URGENT"].includes(item.priority)
    ).length;
    const pendingTaskCount = tasks.filter((item) => item.status !== "DONE").length;
    const riskCount = tasks.filter((item) => item.status === "BLOCKED").length;
    return {
      total: versions.length,
      highPriority: highPriorityCount,
      pendingTasks: pendingTaskCount,
      risks: riskCount
    };
  }, [versions.length, requirements, tasks]);

  const versionNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    versions.forEach((item) => {
      if (item.id != null) {
        map[String(item.id)] = `${item.versionCode} · ${item.name}`;
      }
    });
    return map;
  }, [versions]);

  const productOptions = useMemo<SelectOption[]>(() => {
    return products
      .filter((item) => item.id != null)
      .map((item) => ({
        value: String(item.id ?? ""),
        label: `${item.code} · ${item.name}`
      }));
  }, [products]);

  const productNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    products.forEach((item) => {
      if (item.id != null) {
        map[String(item.id)] = `${item.code} · ${item.name}`;
      }
    });
    return map;
  }, [products]);

  const moduleLabelMap = useMemo(() => {
    const map = new Map<number, ProductModule>();
    modules.forEach((item) => {
      if (item.id != null) {
        map.set(item.id, item);
      }
    });
    const memo = new Map<number, string>();
    const buildPath = (id: number, depth = 0): string => {
      if (memo.has(id)) return memo.get(id) as string;
      const node = map.get(id);
      if (!node || depth > 6) return "";
      if (!node.parentId) {
        memo.set(id, node.name);
        return node.name;
      }
      const parentPath = buildPath(node.parentId, depth + 1);
      const label = parentPath ? `${parentPath} / ${node.name}` : node.name;
      memo.set(id, label);
      return label;
    };
    const result: Record<string, string> = {};
    map.forEach((_, id) => {
      result[String(id)] = buildPath(id);
    });
    return result;
  }, [modules]);

  const getModuleOptions = (productId?: string, allowAll = true) => {
    if (!productId || productId === "全部") {
      if (!allowAll) return [];
    }
    const numericProductId = productId && productId !== "全部" ? Number(productId) : null;
    return modules
      .filter((item) => (numericProductId ? item.productId === numericProductId : true))
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((item) => ({
        value: String(item.id ?? ""),
        label: moduleLabelMap[String(item.id ?? "")] ?? item.name
      }));
  };

  const renderMenuIcon = (menu: MenuItem) => {
    if (menu.iconDataUrl) {
      return (
        <span
          className="icon-mask"
          style={{
            WebkitMaskImage: `url(${menu.iconDataUrl})`,
            maskImage: `url(${menu.iconDataUrl})`
          }}
        />
      );
    }
    if (menu.iconKey && menuIcons[menu.iconKey]) {
      return menuIcons[menu.iconKey];
    }
    return menuIcons.overview;
  };

  const saveMenuConfig = (next: MenuItem[]) => {
    if (saveMenuTimer.current) {
      window.clearTimeout(saveMenuTimer.current);
    }
    saveMenuTimer.current = window.setTimeout(() => {
      saveMenuConfigApi(next).catch(() => null);
    }, 300);
  };

  const updateMenuLabel = (key: MenuNodeKey, label: string, parentKey?: MenuNodeKey) => {
    setMenuConfig((prev) => {
      const next = prev.map((menu) => {
        if (parentKey) {
          if (menu.key !== parentKey) return menu;
          return {
            ...menu,
            children: menu.children?.map((child) =>
              child.key === key ? { ...child, label, title: label } : child
            )
          };
        }
        if (menu.key === key) {
          return { ...menu, label, title: label };
        }
        return menu;
      });
      saveMenuConfig(normalizeMenuConfig(next));
      return next;
    });
  };

  const updateMenuIcon = (key: MenuNodeKey, iconDataUrl: string | null, parentKey?: MenuNodeKey) => {
    setMenuConfig((prev) => {
      const next = prev.map((menu) => {
        if (parentKey) {
          if (menu.key !== parentKey) return menu;
          return {
            ...menu,
            children: menu.children?.map((child) =>
              child.key === key ? { ...child, iconDataUrl } : child
            )
          };
        }
        if (menu.key === key) {
          return { ...menu, iconDataUrl };
        }
        return menu;
      });
      saveMenuConfig(next);
      return next;
    });
  };

  const openMenuEdit = (menu: MenuItem, parentKey?: MenuNodeKey) => {
    setMenuEditTarget({
      key: menu.key,
      parentKey,
      label: menu.label,
      iconDataUrl: menu.iconDataUrl,
      iconKey: menu.iconKey,
      svgText: ""
    });
  };

  const handleMenuIconFile = async (file?: File | null) => {
    if (!file) return;
    if (file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = () => {
        const text = String(reader.result || "");
        handleMenuSvgText(text);
      };
      reader.readAsText(file);
      return;
    }
    if (!file.type.startsWith("image/")) {
      return;
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
    const normalized = await new Promise<string>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const size = 128;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const scale = Math.max(size / img.width, size / img.height);
          const width = img.width * scale;
          const height = img.height * scale;
          const dx = (size - width) / 2;
          const dy = (size - height) / 2;
          ctx.drawImage(img, dx, dy, width, height);
          resolve(canvas.toDataURL("image/png"));
        } else {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
    setMenuEditTarget((prev) =>
      prev
        ? {
            ...prev,
            iconDataUrl: normalized
          }
        : prev
    );
  };

  const handleMenuSvgText = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      setMenuEditTarget((prev) => (prev ? { ...prev, svgText: "", iconDataUrl: prev.iconDataUrl } : prev));
      return;
    }
    if (!trimmed.startsWith("<svg")) {
      setMenuEditTarget((prev) => (prev ? { ...prev, svgText: trimmed } : prev));
      return;
    }
    const dataUrl = svgToDataUrl(trimmed);
    setMenuEditTarget((prev) =>
      prev
        ? {
            ...prev,
            svgText: trimmed,
            iconDataUrl: dataUrl
          }
        : prev
    );
  };

  const reorderMenus = (items: MenuItem[], fromKey: MenuNodeKey, toKey: MenuNodeKey) => {
    const fromIndex = items.findIndex((item) => item.key === fromKey);
    const toIndex = items.findIndex((item) => item.key === toKey);
    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return items;
    const next = [...items];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    return next;
  };

  const handleMenuDrop = (targetKey: MenuNodeKey, parentKey?: MenuNodeKey) => {
    if (!draggingMenu) return;
    if (draggingMenu.parentKey !== parentKey) {
      setDraggingMenu(null);
      setDragOverMenu(null);
      return;
    }
    setMenuConfig((prev) => {
      let next = prev.map((menu) => {
        if (parentKey) {
          if (menu.key !== parentKey || !menu.children) return menu;
          return {
            ...menu,
            children: reorderMenus(menu.children, draggingMenu.key, targetKey)
          };
        }
        return menu;
      });
      if (!parentKey) {
        next = reorderMenus(next, draggingMenu.key, targetKey);
      }
      saveMenuConfig(next);
      return next;
    });
    setDraggingMenu(null);
    setDragOverMenu(null);
  };

  const [productForm, setProductForm] = useState({
    code: "",
    name: "",
    owner: "",
    status: "ACTIVE",
    description: ""
  });
  const [moduleForm, setModuleForm] = useState({
    productId: "",
    parentId: "",
    level: "1",
    code: "",
    name: "",
    owner: "",
    status: "ACTIVE",
    description: ""
  });
  const [versionForm, setVersionForm] = useState({
    productId: "",
    moduleId: "",
    versionCode: "",
    name: "",
    owner: "",
    planReleaseDate: "",
    status: "PLANNED",
    description: ""
  });
  const [requirementForm, setRequirementForm] = useState({
    productId: "",
    moduleId: "",
    code: "",
    name: "",
    priority: "HIGH",
    versionId: "",
    owner: "",
    status: "DRAFT",
    dueDate: "",
    description: ""
  });
  const [taskForm, setTaskForm] = useState({
    productId: "",
    moduleId: "",
    title: "",
    requirementId: "",
    assignee: "",
    status: "TODO",
    dueDate: "",
    description: ""
  });
  const [dictForm, setDictForm] = useState({
    dictType: "REQUIREMENT_STATUS",
    dictCode: "",
    dictLabel: "",
    sortOrder: 1,
    isActive: 1,
    remark: ""
  });
  const [selectedDictType, setSelectedDictType] = useState("REQUIREMENT_STATUS");
  const [draggingDictId, setDraggingDictId] = useState<number | null>(null);
  const [dragOverDictId, setDragOverDictId] = useState<number | null>(null);

  const parentModuleOptions = useMemo(() => {
    const productId = Number(moduleForm.productId || 0);
    const level = Number(moduleForm.level || 1);
    if (!productId || level <= 1) {
      return [];
    }
    return modules
      .filter((item) => item.productId === productId && item.level === level - 1)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((item) => ({
        value: String(item.id ?? ""),
        label: moduleLabelMap[String(item.id ?? "")] ?? item.name
      }));
  }, [modules, moduleForm.productId, moduleForm.level, moduleLabelMap]);

  const versionOptionsForRequirementForm = useMemo(() => {
    const productId = Number(requirementForm.productId || 0);
    const moduleId = Number(requirementForm.moduleId || 0);
    return versions
      .filter((item) => {
        if (productId && item.productId !== productId) {
          return false;
        }
        if (moduleId && item.moduleId !== moduleId) {
          return false;
        }
        return true;
      })
      .map((item) => ({
        value: String(item.id ?? ""),
        label: `${item.versionCode} · ${item.name}`
      }));
  }, [versions, requirementForm.productId, requirementForm.moduleId]);

  const openModal = (
    type: ModalType,
    mode: ModalMode,
    data?: Version | Requirement | TaskItem | DictItem | Product | ProductModule
  ) => {
    setModal({ type, mode, data });
    if (type === "product") {
      const p = data as Product | undefined;
      setProductForm({
        code: p?.code ?? "",
        name: p?.name ?? "",
        owner: p?.owner ?? "",
        status: p?.status ?? "ACTIVE",
        description: p?.description ?? ""
      });
    }
    if (type === "module") {
      const m = data as ProductModule | undefined;
      setModuleForm({
        productId:
          m?.productId
            ? String(m.productId)
            : selectedModuleProductId !== "全部"
              ? selectedModuleProductId
              : "",
        parentId: m?.parentId ? String(m.parentId) : "",
        level: m?.level ? String(m.level) : "1",
        code: m?.code ?? "",
        name: m?.name ?? "",
        owner: m?.owner ?? "",
        status: m?.status ?? "ACTIVE",
        description: m?.description ?? ""
      });
    }
    if (type === "version") {
      const v = data as Version | undefined;
      setVersionForm({
        productId:
          v?.productId ? String(v.productId) : filters.versionProduct !== "全部" ? filters.versionProduct : "",
        moduleId:
          v?.moduleId ? String(v.moduleId) : filters.versionModule !== "全部" ? filters.versionModule : "",
        versionCode: v?.versionCode ?? "",
        name: v?.name ?? "",
        owner: v?.owner ?? "",
        planReleaseDate: v?.planReleaseDate ?? "",
        status: v?.status ?? "PLANNED",
        description: v?.description ?? ""
      });
    }
    if (type === "requirement") {
      const r = data as Requirement | undefined;
      setRequirementForm({
        productId:
          r?.productId ? String(r.productId) : filters.reqProduct !== "全部" ? filters.reqProduct : "",
        moduleId:
          r?.moduleId ? String(r.moduleId) : filters.reqModule !== "全部" ? filters.reqModule : "",
        code: r?.code ?? "",
        name: r?.name ?? "",
        priority: r?.priority ?? "HIGH",
        versionId: r?.versionId ? String(r.versionId) : "",
        owner: r?.owner ?? "",
        status: r?.status ?? "DRAFT",
        dueDate: r?.dueDate ?? "",
        description: r?.description ?? ""
      });
    }
    if (type === "task") {
      const t = data as TaskItem | undefined;
      setTaskForm({
        productId:
          t?.productId ? String(t.productId) : filters.taskProduct !== "全部" ? filters.taskProduct : "",
        moduleId:
          t?.moduleId ? String(t.moduleId) : filters.taskModule !== "全部" ? filters.taskModule : "",
        title: t?.title ?? "",
        requirementId: t?.requirementId ? String(t.requirementId) : "",
        assignee: t?.assignee ?? "",
        status: t?.status ?? "TODO",
        dueDate: t?.dueDate ?? "",
        description: t?.description ?? ""
      });
    }
    if (type === "dict") {
      const d = data as DictItem | undefined;
      const nextType = d?.dictType ?? selectedDictType;
      const nextSortOrder = d?.sortOrder ?? getNextSortOrder(nextType);
      setDictForm({
        dictType: nextType,
        dictCode: d?.dictCode ?? "",
        dictLabel: d?.dictLabel ?? "",
        sortOrder: nextSortOrder,
        isActive: d?.isActive ?? 1,
        remark: d?.remark ?? ""
      });
    }
  };

  const closeModal = () => {
    setModal(emptyModal);
  };

  const handleModalSave = async () => {
    try {
      if (modal.type === "product") {
        if (modal.mode === "create") {
          await createProduct();
        } else {
          await updateProduct();
        }
      } else if (modal.type === "module") {
        if (modal.mode === "create") {
          await createModule();
        } else {
          await updateModule();
        }
      } else if (modal.type === "version") {
        if (modal.mode === "create") {
          await createVersion();
        } else {
          await updateVersion();
        }
      } else if (modal.type === "requirement") {
        if (modal.mode === "create") {
          await createRequirement();
        } else {
          await updateRequirement();
        }
      } else if (modal.type === "task") {
        if (modal.mode === "create") {
          await createTask();
        } else {
          await updateTask();
        }
      } else if (modal.type === "dict") {
        if (modal.mode === "create") {
          await createDict();
        } else {
          await updateDict();
        }
      }
      closeModal();
    } catch (error) {
      alert(String(error));
    }
  };
  const createProduct = async () => {
    if (!productForm.code.trim()) {
      throw new Error("请输入产品编码");
    }
    if (!productForm.name.trim()) {
      throw new Error("请输入产品名称");
    }
    if (!productForm.owner.trim()) {
      throw new Error("请输入负责人");
    }
    const payload = {
      code: productForm.code,
      name: productForm.name,
      owner: productForm.owner,
      status: productForm.status || "ACTIVE",
      description: productForm.description
    };
    const data: Product = await createProductApi(payload);
    setProducts((prev) => [...prev, data]);
  };

  const updateProduct = async () => {
    const current = modal.data as Product | undefined;
    if (!current?.id) return;
    const payload = {
      name: productForm.name,
      owner: productForm.owner,
      status: productForm.status,
      description: productForm.description
    };
    const data: Product = await updateProductApi(current.id, payload);
    setProducts((prev) => prev.map((item) => (item.id === data.id ? data : item)));
  };

  const deleteProduct = async (id?: number) => {
    if (!id) return;
    const product = products.find((item) => item.id === id);
    requestDelete("product", id, product ? `${product.code} · ${product.name}` : `ID: ${id}`);
  };

  const createModule = async () => {
    const productId = Number(moduleForm.productId || 0);
    if (!productId) {
      throw new Error("请选择所属产品");
    }
    const levelValue = Number(moduleForm.level || 1);
    if (levelValue > 1 && !moduleForm.parentId) {
      throw new Error("请选择上级模块");
    }
    if (!moduleForm.code.trim()) {
      throw new Error("请输入模块编码");
    }
    if (!moduleForm.name.trim()) {
      throw new Error("请输入模块名称");
    }
    const payload = {
      productId,
      parentId: moduleForm.parentId ? Number(moduleForm.parentId) : undefined,
      level: levelValue,
      code: moduleForm.code,
      name: moduleForm.name,
      owner: moduleForm.owner || undefined,
      status: moduleForm.status || "ACTIVE",
      description: moduleForm.description
    };
    const data: ProductModule = await createModuleApi(payload);
    setModules((prev) => [...prev, data]);
  };

  const updateModule = async () => {
    const current = modal.data as ProductModule | undefined;
    if (!current?.id) return;
    const payload = {
      productId: moduleForm.productId ? Number(moduleForm.productId) : undefined,
      parentId: moduleForm.parentId ? Number(moduleForm.parentId) : undefined,
      level: moduleForm.level ? Number(moduleForm.level) : undefined,
      code: moduleForm.code,
      name: moduleForm.name,
      owner: moduleForm.owner || undefined,
      status: moduleForm.status || undefined,
      description: moduleForm.description
    };
    const data: ProductModule = await updateModuleApi(current.id, payload);
    setModules((prev) => prev.map((item) => (item.id === data.id ? data : item)));
  };

  const deleteModule = async (id?: number) => {
    if (!id) return;
    const module = modules.find((item) => item.id === id);
    requestDelete("module", id, module ? `${module.code} · ${module.name}` : `ID: ${id}`);
  };

  const createVersion = async () => {
    const productIdValue = Number(versionForm.productId || 0);
    if (!productIdValue) {
      throw new Error("请选择所属产品");
    }
    const moduleIdValue = Number(versionForm.moduleId || 0);
    if (!moduleIdValue) {
      throw new Error("请选择功能模块");
    }
    const payload = {
      productId: productIdValue,
      moduleId: moduleIdValue,
      versionCode: versionForm.versionCode,
      name: versionForm.name,
      owner: versionForm.owner,
      planReleaseDate: versionForm.planReleaseDate,
      description: versionForm.description
    };
    const data: Version = await createVersionApi(payload);
    setVersions((prev) => [...prev, data]);
  };

  const updateVersion = async () => {
    const current = modal.data as Version | undefined;
    if (!current?.id) return;
    const productIdValue = Number(versionForm.productId || 0);
    const moduleIdValue = Number(versionForm.moduleId || 0);
    if (!productIdValue) {
      throw new Error("请选择所属产品");
    }
    if (!moduleIdValue) {
      throw new Error("请选择功能模块");
    }
    const payload = {
      productId: productIdValue,
      moduleId: moduleIdValue,
      name: versionForm.name,
      owner: versionForm.owner,
      planReleaseDate: versionForm.planReleaseDate,
      status: versionForm.status,
      description: versionForm.description
    };
    const data: Version = await updateVersionApi(current.id, payload);
    setVersions((prev) => prev.map((item) => (item.id === data.id ? data : item)));
  };

  const deleteVersion = async (id?: number) => {
    if (!id) return;
    const version = versions.find((item) => item.id === id);
    requestDelete("version", id, version ? `${version.versionCode} · ${version.name}` : `ID: ${id}`);
  };

  const createRequirement = async () => {
    if (!requirementForm.code.trim()) {
      throw new Error("请输入需求编号");
    }
    if (!requirementForm.name.trim()) {
      throw new Error("请输入需求名称");
    }
    if (!requirementForm.owner.trim()) {
      throw new Error("请输入负责人");
    }
    const productIdValue = Number(requirementForm.productId || 0);
    if (!productIdValue) {
      throw new Error("请选择所属产品");
    }
    const moduleIdValue = Number(requirementForm.moduleId || 0);
    if (!moduleIdValue) {
      throw new Error("请选择功能模块");
    }
    const versionIdValue = Number(requirementForm.versionId);
    if (!versionIdValue) {
      throw new Error("请选择关联版本");
    }
    const payload = {
      productId: productIdValue,
      moduleId: moduleIdValue,
      code: requirementForm.code,
      name: requirementForm.name,
      description: requirementForm.description,
      priority: requirementForm.priority,
      versionId: versionIdValue,
      owner: requirementForm.owner,
      dueDate: requirementForm.dueDate || undefined
    };
    const data: Requirement = await createRequirementApi(payload);
    setRequirements((prev) => [...prev, data]);
  };

  const updateRequirement = async () => {
    const current = modal.data as Requirement | undefined;
    if (!current?.id) return;
    const productIdValue = Number(requirementForm.productId || 0);
    const moduleIdValue = Number(requirementForm.moduleId || 0);
    if (!productIdValue) {
      throw new Error("请选择所属产品");
    }
    if (!moduleIdValue) {
      throw new Error("请选择功能模块");
    }
    const payload = {
      productId: productIdValue,
      moduleId: moduleIdValue,
      name: requirementForm.name,
      description: requirementForm.description,
      priority: requirementForm.priority,
      status: requirementForm.status,
      versionId: Number(requirementForm.versionId || 0),
      owner: requirementForm.owner,
      dueDate: requirementForm.dueDate
    };
    const data: Requirement = await updateRequirementApi(current.id, payload);
    setRequirements((prev) => prev.map((item) => (item.id === data.id ? data : item)));
  };

  const deleteRequirement = async (id?: number) => {
    if (!id) return;
    const requirement = requirements.find((item) => item.id === id);
    requestDelete(
      "requirement",
      id,
      requirement ? `${requirement.code} · ${requirement.name}` : `ID: ${id}`
    );
  };

  const createTask = async () => {
    const productId = Number(taskForm.productId || 0);
    if (!productId) {
      throw new Error("请选择所属产品");
    }
    const moduleId = Number(taskForm.moduleId || 0);
    if (!moduleId) {
      throw new Error("请选择功能模块");
    }
    const payload = {
      productId,
      moduleId,
      requirementId: Number(taskForm.requirementId || 0),
      title: taskForm.title,
      description: taskForm.description,
      assignee: taskForm.assignee
    };
    const data: TaskItem = await createTaskApi(payload);
    setTasks((prev) => [...prev, data]);
  };

  const updateTask = async () => {
    const current = modal.data as TaskItem | undefined;
    if (!current?.id) return;
    const productIdValue = Number(taskForm.productId || 0);
    const moduleIdValue = Number(taskForm.moduleId || 0);
    if (!productIdValue) {
      throw new Error("请选择所属产品");
    }
    if (!moduleIdValue) {
      throw new Error("请选择功能模块");
    }
    const payload = {
      productId: productIdValue,
      moduleId: moduleIdValue,
      title: taskForm.title,
      description: taskForm.description,
      assignee: taskForm.assignee,
      status: taskForm.status,
      dueDate: taskForm.dueDate
    };
    const data: TaskItem = await updateTaskApi(current.id, payload);
    setTasks((prev) => prev.map((item) => (item.id === data.id ? data : item)));
  };

  const deleteTask = async (id?: number) => {
    if (!id) return;
    const task = tasks.find((item) => item.id === id);
    requestDelete("task", id, task ? task.title : `ID: ${id}`);
  };

  const createDict = async () => {
    const payload = {
      dictType: dictForm.dictType,
      dictCode: dictForm.dictCode,
      dictLabel: dictForm.dictLabel,
      sortOrder: Number(dictForm.sortOrder || 0),
      isActive: Number(dictForm.isActive || 0),
      remark: dictForm.remark
    };
    const data: DictItem = await createDictItemApi(payload);
    setDictItems((prev) => [...prev, data]);
  };

  const updateDict = async () => {
    const current = modal.data as DictItem | undefined;
    if (!current?.id) return;
    const payload = {
      dictType: dictForm.dictType,
      dictCode: dictForm.dictCode,
      dictLabel: dictForm.dictLabel,
      sortOrder: Number(dictForm.sortOrder || 0),
      isActive: Number(dictForm.isActive || 0),
      remark: dictForm.remark
    };
    const data: DictItem = await updateDictItemApi(current.id, payload);
    setDictItems((prev) => prev.map((item) => (item.id === data.id ? data : item)));
  };

  const deleteDict = async (id?: number) => {
    if (!id) return;
    const dict = dictItems.find((item) => item.id === id);
    requestDelete("dict", id, dict ? `${dict.dictCode} · ${dict.dictLabel}` : `ID: ${id}`);
  };

  const fallbackVersionStatusOptions = [
    { value: "PLANNED", label: "规划中" },
    { value: "REVIEW", label: "评审中" },
    { value: "RELEASED", label: "已发布" },
    { value: "DEPRECATED", label: "已废弃" }
  ];
  const fallbackRequirementStatusOptions = [
    { value: "DRAFT", label: "草稿" },
    { value: "REVIEW", label: "评审中" },
    { value: "APPROVED", label: "已确认" },
    { value: "IN_PROGRESS", label: "进行中" },
    { value: "DONE", label: "已完成" },
    { value: "ARCHIVED", label: "已归档" }
  ];
  const fallbackTaskStatusOptions = [
    { value: "TODO", label: "待开始" },
    { value: "IN_PROGRESS", label: "进行中" },
    { value: "BLOCKED", label: "阻塞" },
    { value: "DONE", label: "已完成" }
  ];
  const fallbackPriorityOptions = [
    { value: "HIGH", label: "高" },
    { value: "MEDIUM", label: "中" },
    { value: "LOW", label: "低" },
    { value: "URGENT", label: "紧急" }
  ];
  const productStatusOptions = [
    { value: "ACTIVE", label: "启用" },
    { value: "INACTIVE", label: "停用" }
  ];
  const moduleLevelOptions = [
    { value: "1", label: "一级模块" },
    { value: "2", label: "二级模块" },
    { value: "3", label: "三级模块" }
  ];
  const fallbackVersionStatusMap = fallbackVersionStatusOptions.reduce((acc, item) => {
    acc[item.value] = item.label;
    return acc;
  }, {} as Record<string, string>);
  const fallbackRequirementStatusMap = fallbackRequirementStatusOptions.reduce((acc, item) => {
    acc[item.value] = item.label;
    return acc;
  }, {} as Record<string, string>);
  const fallbackTaskStatusMap = fallbackTaskStatusOptions.reduce((acc, item) => {
    acc[item.value] = item.label;
    return acc;
  }, {} as Record<string, string>);
  const fallbackPriorityMap = fallbackPriorityOptions.reduce((acc, item) => {
    acc[item.value] = item.label;
    return acc;
  }, {} as Record<string, string>);

  const dictLabelMapByType = useMemo(() => {
    const map: Record<string, Record<string, string>> = {};
    dictItems.forEach((item) => {
      if (!map[item.dictType]) {
        map[item.dictType] = {};
      }
      map[item.dictType][item.dictCode] = item.dictLabel;
    });
    return map;
  }, [dictItems]);

  const buildLabelMap = (type: string, fallbackMap: Record<string, string>) => ({
    ...fallbackMap,
    ...(dictLabelMapByType[type] ?? {})
  });

  const buildFormOptions = (
    type: string,
    fallbackOptions: { value: string; label: string }[]
  ) => {
    const items = dictItems
      .filter((item) => item.dictType === type && item.isActive === 1)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((item) => ({
        value: item.dictCode,
        label: item.dictLabel
      }));
    return items.length > 0 ? items : fallbackOptions;
  };

  const buildFilterOptions = (
    type: string,
    fallbackOptions: { value: string; label: string }[]
  ) => {
    const active = dictItems
      .filter((item) => item.dictType === type && item.isActive === 1)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((item) => ({ value: item.dictCode, label: item.dictLabel }));
    return active.length > 0 ? active : fallbackOptions;
  };

  const versionStatusLabel = useMemo(
    () => buildLabelMap("VERSION_STATUS", fallbackVersionStatusMap),
    [dictLabelMapByType]
  );
  const requirementStatusLabel = useMemo(
    () => buildLabelMap("REQUIREMENT_STATUS", fallbackRequirementStatusMap),
    [dictLabelMapByType]
  );
  const taskStatusLabel = useMemo(
    () => buildLabelMap("TASK_STATUS", fallbackTaskStatusMap),
    [dictLabelMapByType]
  );
  const priorityLabel = useMemo(
    () => buildLabelMap("PRIORITY", fallbackPriorityMap),
    [dictLabelMapByType]
  );

  const versionStatusOptions = useMemo(
    () => buildFormOptions("VERSION_STATUS", fallbackVersionStatusOptions),
    [dictItems]
  );
  const requirementStatusOptions = useMemo(
    () => buildFormOptions("REQUIREMENT_STATUS", fallbackRequirementStatusOptions),
    [dictItems]
  );
  const taskStatusOptions = useMemo(
    () => buildFormOptions("TASK_STATUS", fallbackTaskStatusOptions),
    [dictItems]
  );
  const priorityOptions = useMemo(
    () => buildFormOptions("PRIORITY", fallbackPriorityOptions),
    [dictItems]
  );
  const versionStatusFilterOptions = useMemo(
    () => buildFilterOptions("VERSION_STATUS", fallbackVersionStatusOptions),
    [dictItems]
  );
  const taskStatusFilterOptions = useMemo(
    () => buildFilterOptions("TASK_STATUS", fallbackTaskStatusOptions),
    [dictItems]
  );
  const priorityFilterOptions = useMemo(
    () => buildFilterOptions("PRIORITY", fallbackPriorityOptions),
    [dictItems]
  );

  const activeDictCodesByType = useMemo(() => {
    const map: Record<string, string[]> = {};
    dictItems
      .filter((item) => item.isActive === 1)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .forEach((item) => {
        if (!map[item.dictType]) {
          map[item.dictType] = [];
        }
        map[item.dictType].push(item.dictCode);
      });
    return map;
  }, [dictItems]);

  const ensureActiveValue = (
    type: string,
    current: string,
    fallbackOptions: { value: string; label: string }[]
  ) => {
    const active = activeDictCodesByType[type] ?? [];
    if (active.length === 0) {
      return current || fallbackOptions[0]?.value || "";
    }
    if (current && active.includes(current)) {
      return current;
    }
    return active[0];
  };

  useEffect(() => {
    setVersionForm((prev) => {
      const nextStatus = ensureActiveValue("VERSION_STATUS", prev.status, fallbackVersionStatusOptions);
      if (nextStatus === prev.status) return prev;
      return { ...prev, status: nextStatus };
    });
    setRequirementForm((prev) => {
      const nextPriority = ensureActiveValue("PRIORITY", prev.priority, fallbackPriorityOptions);
      const nextStatus = ensureActiveValue(
        "REQUIREMENT_STATUS",
        prev.status,
        fallbackRequirementStatusOptions
      );
      if (nextPriority === prev.priority && nextStatus === prev.status) return prev;
      return { ...prev, priority: nextPriority, status: nextStatus };
    });
    setTaskForm((prev) => {
      const nextStatus = ensureActiveValue("TASK_STATUS", prev.status, fallbackTaskStatusOptions);
      if (nextStatus === prev.status) return prev;
      return { ...prev, status: nextStatus };
    });
  }, [activeDictCodesByType]);

  useEffect(() => {
    const activeVersionLabels = new Set(versionStatusFilterOptions.map((item) => item.label));
    const activePriorityLabels = new Set(priorityFilterOptions.map((item) => item.label));
    const activeTaskLabels = new Set(taskStatusFilterOptions.map((item) => item.label));

    setFilters((prev) => {
      const next = { ...prev };
      if (prev.versionStatus !== "全部" && !activeVersionLabels.has(prev.versionStatus)) {
        next.versionStatus = "全部";
      }
      if (prev.reqPriority !== "全部" && !activePriorityLabels.has(prev.reqPriority)) {
        next.reqPriority = "全部";
      }
      if (prev.taskStatus !== "全部" && !activeTaskLabels.has(prev.taskStatus)) {
        next.taskStatus = "全部";
      }
      return next.versionStatus === prev.versionStatus &&
        next.reqPriority === prev.reqPriority &&
        next.taskStatus === prev.taskStatus
        ? prev
        : next;
    });

    setAppliedFilters((prev) => {
      const next = { ...prev };
      if (prev.versionStatus !== "全部" && !activeVersionLabels.has(prev.versionStatus)) {
        next.versionStatus = "全部";
      }
      if (prev.reqPriority !== "全部" && !activePriorityLabels.has(prev.reqPriority)) {
        next.reqPriority = "全部";
      }
      if (prev.taskStatus !== "全部" && !activeTaskLabels.has(prev.taskStatus)) {
        next.taskStatus = "全部";
      }
      return next.versionStatus === prev.versionStatus &&
        next.reqPriority === prev.reqPriority &&
        next.taskStatus === prev.taskStatus
        ? prev
        : next;
    });
  }, [versionStatusFilterOptions, priorityFilterOptions, taskStatusFilterOptions]);
  const dictTypeOptions = [
    { value: "REQUIREMENT_STATUS", label: "需求状态" },
    { value: "PRIORITY", label: "需求优先级" },
    { value: "TASK_STATUS", label: "任务状态" },
    { value: "VERSION_STATUS", label: "版本状态" }
  ];
  const dictTypeLabel: Record<string, string> = dictTypeOptions.reduce((acc, item) => {
    acc[item.value] = item.label;
    return acc;
  }, {} as Record<string, string>);
  const labelOf = (value: string, map: Record<string, string>) => map[value] ?? value;

  const filteredVersions = useMemo(() => {
    return versions.filter((item) => {
      if (
        appliedFilters.versionProduct !== "全部" &&
        String(item.productId ?? "") !== appliedFilters.versionProduct
      ) {
        return false;
      }
      if (
        appliedFilters.versionModule !== "全部" &&
        String(item.moduleId ?? "") !== appliedFilters.versionModule
      ) {
        return false;
      }
      const statusLabel = labelOf(item.status, versionStatusLabel);
      if (appliedFilters.versionStatus !== "全部" && statusLabel !== appliedFilters.versionStatus) {
        return false;
      }
      if (appliedFilters.versionOwner && !item.owner.includes(appliedFilters.versionOwner)) {
        return false;
      }
      const startDate = appliedFilters.versionDateStart.trim();
      const endDate = appliedFilters.versionDateEnd.trim();
      if ((startDate || endDate) && !item.planReleaseDate) {
        return false;
      }
      if (startDate && item.planReleaseDate < startDate) {
        return false;
      }
      if (endDate && item.planReleaseDate > endDate) {
        return false;
      }
      return true;
    });
  }, [versions, appliedFilters, versionStatusLabel]);

  const filteredRequirements = useMemo(() => {
    return requirements.filter((item) => {
      if (
        appliedFilters.reqProduct !== "全部" &&
        String(item.productId ?? "") !== appliedFilters.reqProduct
      ) {
        return false;
      }
      if (
        appliedFilters.reqModule !== "全部" &&
        String(item.moduleId ?? "") !== appliedFilters.reqModule
      ) {
        return false;
      }
      const priority = labelOf(item.priority, priorityLabel);
      if (appliedFilters.reqPriority !== "全部" && priority !== appliedFilters.reqPriority) {
        return false;
      }
      if (appliedFilters.reqVersion !== "全部" && appliedFilters.reqVersion) {
        if (String(item.versionId) !== appliedFilters.reqVersion) {
          return false;
        }
      }
      if (selectedVersionId !== "全部" && String(item.versionId) !== selectedVersionId) {
        return false;
      }
      if (appliedFilters.reqOwner && !item.owner.includes(appliedFilters.reqOwner)) {
        return false;
      }
      return true;
    });
  }, [requirements, appliedFilters, priorityLabel, selectedVersionId]);

  const versionsForRequirement = useMemo(() => {
    const productId = filters.reqProduct !== "全部" ? Number(filters.reqProduct) : null;
    const moduleId = filters.reqModule !== "全部" ? Number(filters.reqModule) : null;
    return versions.filter((item) => {
      if (productId && item.productId !== productId) {
        return false;
      }
      if (moduleId && item.moduleId !== moduleId) {
        return false;
      }
      return true;
    });
  }, [versions, filters.reqProduct, filters.reqModule]);

  useEffect(() => {
    if (
      selectedVersionId !== "全部" &&
      !versionsForRequirement.some((item) => String(item.id ?? "") === selectedVersionId)
    ) {
      setSelectedVersionId("全部");
    }
  }, [selectedVersionId, versionsForRequirement]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((item) => {
      if (
        appliedFilters.taskProduct !== "全部" &&
        String(item.productId ?? "") !== appliedFilters.taskProduct
      ) {
        return false;
      }
      if (
        appliedFilters.taskModule !== "全部" &&
        String(item.moduleId ?? "") !== appliedFilters.taskModule
      ) {
        return false;
      }
      const status = labelOf(item.status, taskStatusLabel);
      if (appliedFilters.taskStatus !== "全部" && status !== appliedFilters.taskStatus) {
        return false;
      }
      if (appliedFilters.taskOwner && !item.assignee.includes(appliedFilters.taskOwner)) {
        return false;
      }
      if (appliedFilters.taskDue && !(item.dueDate ?? "").includes(appliedFilters.taskDue)) {
        return false;
      }
      return true;
    });
  }, [tasks, appliedFilters, taskStatusLabel]);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      if (
        appliedProductFilters.status !== "全部" &&
        item.status !== appliedProductFilters.status
      ) {
        return false;
      }
      if (appliedProductFilters.owner && !item.owner.includes(appliedProductFilters.owner)) {
        return false;
      }
      if (appliedProductFilters.keyword) {
        const keyword = appliedProductFilters.keyword;
        if (!item.name.includes(keyword) && !item.code.includes(keyword)) {
          return false;
        }
      }
      return true;
    });
  }, [products, appliedProductFilters]);

  const filteredModules = useMemo(() => {
    return modules.filter((item) => {
      if (
        selectedModuleProductId !== "全部" &&
        String(item.productId ?? "") !== selectedModuleProductId
      ) {
        return false;
      }
      if (moduleLevelFilter !== "全部" && String(item.level ?? "") !== moduleLevelFilter) {
        return false;
      }
      if (moduleStatusFilter !== "全部" && item.status !== moduleStatusFilter) {
        return false;
      }
      return true;
    });
  }, [modules, selectedModuleProductId, moduleLevelFilter, moduleStatusFilter]);

  const productPage = useMemo(
    () => paginateItems(filteredProducts, pagination.products.page, pagination.products.size),
    [filteredProducts, pagination.products.page, pagination.products.size]
  );
  const modulePage = useMemo(
    () => paginateItems(filteredModules, pagination.modules.page, pagination.modules.size),
    [filteredModules, pagination.modules.page, pagination.modules.size]
  );
  const versionPage = useMemo(
    () =>
      paginateItems(filteredVersions, pagination.versions.page, pagination.versions.size),
    [filteredVersions, pagination.versions.page, pagination.versions.size]
  );
  const requirementPage = useMemo(
    () =>
      paginateItems(filteredRequirements, pagination.requirements.page, pagination.requirements.size),
    [filteredRequirements, pagination.requirements.page, pagination.requirements.size]
  );
  const taskPage = useMemo(
    () => paginateItems(filteredTasks, pagination.tasks.page, pagination.tasks.size),
    [filteredTasks, pagination.tasks.page, pagination.tasks.size]
  );

  useEffect(() => {
    if (pagination.versions.page !== versionPage.page) {
      setPagination((prev) => ({
        ...prev,
        versions: { ...prev.versions, page: versionPage.page }
      }));
    }
  }, [pagination.versions.page, versionPage.page]);

  useEffect(() => {
    if (pagination.requirements.page !== requirementPage.page) {
      setPagination((prev) => ({
        ...prev,
        requirements: { ...prev.requirements, page: requirementPage.page }
      }));
    }
  }, [pagination.requirements.page, requirementPage.page]);

  useEffect(() => {
    if (pagination.tasks.page !== taskPage.page) {
      setPagination((prev) => ({
        ...prev,
        tasks: { ...prev.tasks, page: taskPage.page }
      }));
    }
  }, [pagination.tasks.page, taskPage.page]);

  const dictItemsByType = useMemo(() => {
    return dictItems
      .filter((item) => item.dictType === selectedDictType)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [dictItems, selectedDictType]);

  const dictPage = useMemo(
    () => paginateItems(dictItemsByType, pagination.dicts.page, pagination.dicts.size),
    [dictItemsByType, pagination.dicts.page, pagination.dicts.size]
  );

  useEffect(() => {
    if (pagination.dicts.page !== dictPage.page) {
      setPagination((prev) => ({
        ...prev,
        dicts: { ...prev.dicts, page: dictPage.page }
      }));
    }
  }, [pagination.dicts.page, dictPage.page]);

  const getNextSortOrder = (type: string) =>
    dictItems.filter((item) => item.dictType === type).length + 1;

  const persistDictOrder = async (items: DictItem[]) => {
    try {
      await Promise.all(
        items
          .filter((item) => item.id != null)
          .map((item, index) =>
            updateDictItemApi(Number(item.id), {
              dictType: item.dictType,
              dictCode: item.dictCode,
              dictLabel: item.dictLabel,
              sortOrder: index + 1,
              isActive: item.isActive,
              remark: item.remark ?? ""
            })
          )
      );
    } catch (error) {
      alert(String(error));
    }
  };

  const reorderDictItems = (sourceId: number, targetId: number) => {
    if (sourceId === targetId) return;
    const current = dictItemsByType;
    const sourceIndex = current.findIndex((item) => item.id === sourceId);
    const targetIndex = current.findIndex((item) => item.id === targetId);
    if (sourceIndex < 0 || targetIndex < 0) return;
    const reordered = [...current];
    const [moved] = reordered.splice(sourceIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    const updated = reordered.map((item, index) => ({ ...item, sortOrder: index + 1 }));
    setDictItems((prev) =>
      prev.map((item) => updated.find((u) => u.id === item.id) ?? item)
    );
    persistDictOrder(updated);
  };

  const versionFilterActive =
    appliedFilters.versionProduct !== "全部" ||
    appliedFilters.versionModule !== "全部" ||
    appliedFilters.versionStatus !== "全部" ||
    appliedFilters.versionOwner.trim() !== "" ||
    appliedFilters.versionDateStart.trim() !== "" ||
    appliedFilters.versionDateEnd.trim() !== "";
  const productFilterActive =
    appliedProductFilters.status !== "全部" ||
    appliedProductFilters.owner.trim() !== "" ||
    appliedProductFilters.keyword.trim() !== "";
  const requirementFilterActive =
    appliedFilters.reqProduct !== "全部" ||
    appliedFilters.reqModule !== "全部" ||
    appliedFilters.reqPriority !== "全部" ||
    appliedFilters.reqVersion !== "全部" ||
    appliedFilters.reqOwner.trim() !== "" ||
    selectedVersionId !== "全部";
  const taskFilterActive =
    appliedFilters.taskProduct !== "全部" ||
    appliedFilters.taskModule !== "全部" ||
    appliedFilters.taskStatus !== "全部" ||
    appliedFilters.taskOwner.trim() !== "" ||
    appliedFilters.taskDue.trim() !== "";

  return (
    <AppShell className={`app ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <aside className="sidebar">
        <button className="collapse-btn" onClick={() => setSidebarCollapsed((v) => !v)}>
          <IconCollapse collapsed={sidebarCollapsed} />
        </button>
        <div className="brand">
          <div className="brand-icon">
            {appIcon ? <img src={appIcon} alt="应用图标" /> : "RD"}
          </div>
          <div className="brand-text">
            <div className="brand-title">{appName}</div>
            <div className="brand-sub">研发管理平台</div>
          </div>
        </div>

        <nav className="nav">
          {menuConfig.map((menu) => {
            if (!menu.children || menu.children.length === 0) {
              return (
                <button
                  key={menu.key}
                  className={`nav-item simple ${activeMenu === menu.key ? "active" : ""}`}
                  onClick={() => setActiveMenu(menu.key)}
                  title={menu.label}
                >
                  <span className="nav-icon">{renderMenuIcon(menu)}</span>
                  <span className="nav-label">{menu.label}</span>
                </button>
              );
            }
            if (menu.key === "productGroup") {
              return (
                <div
                  key={menu.key}
                  className={`nav-group ${productExpanded ? "open" : ""}`}
                  onMouseEnter={() => sidebarCollapsed && setProductHover(true)}
                  onMouseLeave={() => setProductHover(false)}
                >
                  <button
                    type="button"
                    className={`nav-item nav-group-toggle ${
                      productMenus.some((menuItem) => menuItem.key === activeMenu) ? "active" : ""
                    }`}
                    onClick={() => {
                      if (sidebarCollapsed) {
                        setProductHover((prev) => !prev);
                      } else {
                        setProductExpanded((prev) => !prev);
                      }
                    }}
                  >
                    <span className="nav-icon">
                      {productMenuGroup ? renderMenuIcon(productMenuGroup) : menuIcons.products}
                    </span>
                    <span className="nav-label">{productMenuGroup?.label ?? "产品管理"}</span>
                    <span className="nav-caret">
                      <IconChevron open={productExpanded} />
                    </span>
                  </button>
                  {sidebarCollapsed && productHover && (
                    <div className="nav-popover">
                      {productMenus.map((menuItem) => (
                        <button
                          key={menuItem.key}
                          className={`nav-item nav-popover-item ${
                            activeMenu === menuItem.key ? "active" : ""
                          }`}
                          onClick={() => {
                            setActiveMenu(menuItem.key);
                            setProductHover(false);
                          }}
                        >
                          <span className="nav-icon">{renderMenuIcon(menuItem)}</span>
                          <span className="nav-label">{menuItem.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {!sidebarCollapsed && productExpanded && (
                    <div className="nav-sub">
                      {productMenus.map((menuItem) => (
                        <button
                          key={menuItem.key}
                          className={`nav-item nav-sub-item ${
                            activeMenu === menuItem.key ? "active" : ""
                          }`}
                          onClick={() => setActiveMenu(menuItem.key)}
                          title={menuItem.label}
                        >
                          <span className="nav-icon">{renderMenuIcon(menuItem)}</span>
                          <span className="nav-label">{menuItem.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            if (menu.key === "system") {
              return (
                <div
                  key={menu.key}
                  className={`nav-group ${systemExpanded ? "open" : ""}`}
                  onMouseEnter={() => sidebarCollapsed && setSystemHover(true)}
                  onMouseLeave={() => setSystemHover(false)}
                >
                  <button
                    type="button"
                    className={`nav-item nav-group-toggle ${
                      systemMenus.some((menuItem) => menuItem.key === activeMenu) ? "active" : ""
                    }`}
                    onClick={() => {
                      if (sidebarCollapsed) {
                        setSystemHover((prev) => !prev);
                      } else {
                        setSystemExpanded((prev) => !prev);
                      }
                    }}
                  >
                    <span className="nav-icon">
                      {systemMenuGroup ? renderMenuIcon(systemMenuGroup) : menuIcons.system}
                    </span>
                    <span className="nav-label">{systemMenuGroup?.label ?? "系统管理"}</span>
                    <span className="nav-caret">
                      <IconChevron open={systemExpanded} />
                    </span>
                  </button>
                  {sidebarCollapsed && systemHover && (
                    <div className="nav-popover">
                      {systemMenus.map((menuItem) => (
                        <button
                          key={menuItem.key}
                          className={`nav-item nav-popover-item ${
                            activeMenu === menuItem.key ? "active" : ""
                          }`}
                          onClick={() => {
                            setActiveMenu(menuItem.key);
                            setSystemHover(false);
                          }}
                        >
                          <span className="nav-icon">{renderMenuIcon(menuItem)}</span>
                          <span className="nav-label">{menuItem.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {!sidebarCollapsed && systemExpanded && (
                    <div className="nav-sub">
                      {systemMenus.map((menuItem) => (
                        <button
                          key={menuItem.key}
                          className={`nav-item nav-sub-item ${
                            activeMenu === menuItem.key ? "active" : ""
                          }`}
                          onClick={() => setActiveMenu(menuItem.key)}
                          title={menuItem.label}
                        >
                          <span className="nav-icon">{renderMenuIcon(menuItem)}</span>
                          <span className="nav-label">{menuItem.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return null;
          })}
        </nav>
      </aside>

      <div
        className={`main ${
          activeMenu === "requirements" || activeMenu === "dicts" ? "main-locked" : ""
        } ${
          activeMenu === "overview" || activeMenu === "reports" || activeMenu === "menus"
            ? "main-scroll"
            : ""
        }`}
      >
        <PageHeader
          title={pageMeta[activeMenu].title}
          subtitle={pageMeta[activeMenu].subtitle}
          tips={[versionError, requirementError, taskError, dictError]}
        />

        {activeMenu === "overview" && (
          <OverviewPage
            versionStats={versionStats}
            loadingVersions={loadingVersions}
            versions={versions}
            loadingTasks={loadingTasks}
            tasks={tasks}
            loadingRequirements={loadingRequirements}
            requirements={requirements}
            versionStatusLabel={versionStatusLabel}
            taskStatusLabel={taskStatusLabel}
            priorityLabel={priorityLabel}
            onNavigate={(menu) => setActiveMenu(menu)}
          />
        )}
        {activeMenu === "products" && (
          <ProductsPage
            productFilters={productFilters}
            setProductFilters={setProductFilters}
            setAppliedProductFilters={setAppliedProductFilters}
            productStatusOptions={productStatusOptions}
            handleProductFilterSubmit={handleProductFilterSubmit}
            openModal={openModal}
            deleteProduct={deleteProduct}
            viewMode={viewMode.products}
            toggleViewMode={(mode) => toggleViewMode("products", mode)}
            productError={productError}
            loadingProducts={loadingProducts}
            filteredProductsLength={filteredProducts.length}
            productFilterActive={productFilterActive}
            productPage={productPage}
            paginationSize={pagination.products.size}
            onPageChange={(next) =>
              setPagination((prev) => ({
                ...prev,
                products: { ...prev.products, page: next }
              }))
            }
            onSizeChange={(next) =>
              setPagination((prev) => ({
                ...prev,
                products: { page: 1, size: next }
              }))
            }
          />
        )}
        {activeMenu === "modules" && (
          <ModulesPage
            handleModuleFilterSubmit={handleModuleFilterSubmit}
            selectedModuleProductId={selectedModuleProductId}
            setSelectedModuleProductId={setSelectedModuleProductId}
            moduleLevelFilter={moduleLevelFilter}
            setModuleLevelFilter={setModuleLevelFilter}
            moduleStatusFilter={moduleStatusFilter}
            setModuleStatusFilter={setModuleStatusFilter}
            productOptions={productOptions}
            moduleLevelOptions={moduleLevelOptions}
            productStatusOptions={productStatusOptions}
            openModal={openModal}
            viewMode={viewMode.modules}
            toggleViewMode={(mode) => toggleViewMode("modules", mode)}
            moduleError={moduleError}
            loadingModules={loadingModules}
            filteredModulesLength={filteredModules.length}
            modulePage={modulePage}
            moduleLabelMap={moduleLabelMap}
            productNameMap={productNameMap}
            deleteModule={deleteModule}
            paginationSize={pagination.modules.size}
            onPageChange={(next) =>
              setPagination((prev) => ({
                ...prev,
                modules: { ...prev.modules, page: next }
              }))
            }
            onSizeChange={(next) =>
              setPagination((prev) => ({
                ...prev,
                modules: { page: 1, size: next }
              }))
            }
          />
        )}
        {activeMenu === "versions" && (
          <VersionsPage
            handleFilterSubmit={handleFilterSubmit}
            filters={{
              versionProduct: filters.versionProduct,
              versionModule: filters.versionModule,
              versionStatus: filters.versionStatus,
              versionOwner: filters.versionOwner,
              versionDateStart: filters.versionDateStart,
              versionDateEnd: filters.versionDateEnd
            }}
            productOptions={productOptions}
            moduleOptions={getModuleOptions(filters.versionProduct)}
            versionStatusFilterOptions={versionStatusFilterOptions}
            onVersionProductChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                versionProduct: value,
                versionModule: "全部"
              }))
            }
            onVersionProductCommit={(value) =>
              setAppliedFilters((prev) => ({
                ...prev,
                versionProduct: value,
                versionModule: "全部"
              }))
            }
            onVersionModuleChange={(value) =>
              setFilters((prev) => ({ ...prev, versionModule: value }))
            }
            onVersionModuleCommit={(value) =>
              setAppliedFilters((prev) => ({ ...prev, versionModule: value }))
            }
            onVersionStatusChange={(value) =>
              setFilters((prev) => ({ ...prev, versionStatus: value }))
            }
            onVersionStatusCommit={(value) =>
              setAppliedFilters((prev) => ({ ...prev, versionStatus: value }))
            }
            onVersionOwnerChange={(value) =>
              setFilters((prev) => ({ ...prev, versionOwner: value }))
            }
            onVersionOwnerCommit={(value) =>
              setAppliedFilters((prev) => ({ ...prev, versionOwner: value }))
            }
            onVersionDateStartChange={(value) =>
              setFilters((prev) => ({ ...prev, versionDateStart: value }))
            }
            onVersionDateStartCommit={(value) =>
              setAppliedFilters((prev) => ({ ...prev, versionDateStart: value }))
            }
            onVersionDateEndChange={(value) =>
              setFilters((prev) => ({ ...prev, versionDateEnd: value }))
            }
            onVersionDateEndCommit={(value) =>
              setAppliedFilters((prev) => ({ ...prev, versionDateEnd: value }))
            }
            onCreate={() => openModal("version", "create")}
            viewMode={viewMode.versions}
            onViewModeChange={(mode) => toggleViewMode("versions", mode)}
            loadingVersions={loadingVersions}
            filteredVersionsLength={filteredVersions.length}
            versionFilterActive={versionFilterActive}
            versionPage={versionPage}
            versionStatusLabel={versionStatusLabel}
            labelOf={labelOf}
            onEdit={(item) => openModal("version", "edit", item)}
            onDelete={deleteVersion}
            paginationSize={pagination.versions.size}
            onPageChange={(next) =>
              setPagination((prev) => ({
                ...prev,
                versions: { ...prev.versions, page: next }
              }))
            }
            onSizeChange={(next) =>
              setPagination((prev) => ({
                ...prev,
                versions: { page: 1, size: next }
              }))
            }
          />
        )}
        {activeMenu === "requirements" && (
          <RequirementsPage
            selectedVersionId={selectedVersionId}
            setSelectedVersionId={setSelectedVersionId}
            versionsForRequirement={versionsForRequirement}
            handleFilterSubmit={handleFilterSubmit}
            filters={{
              reqProduct: filters.reqProduct,
              reqModule: filters.reqModule,
              reqPriority: filters.reqPriority,
              reqVersion: filters.reqVersion,
              reqOwner: filters.reqOwner
            }}
            productOptions={productOptions}
            priorityFilterOptions={priorityFilterOptions}
            moduleOptions={getModuleOptions(filters.reqProduct)}
            onReqProductChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                reqProduct: value,
                reqModule: "全部",
                reqVersion: "全部"
              }))
            }
            onReqProductCommit={(value) =>
              setAppliedFilters((prev) => ({
                ...prev,
                reqProduct: value,
                reqModule: "全部",
                reqVersion: "全部"
              }))
            }
            onReqModuleChange={(value) =>
              setFilters((prev) => ({ ...prev, reqModule: value, reqVersion: "全部" }))
            }
            onReqModuleCommit={(value) =>
              setAppliedFilters((prev) => ({
                ...prev,
                reqModule: value,
                reqVersion: "全部"
              }))
            }
            onReqPriorityChange={(value) => setFilters((prev) => ({ ...prev, reqPriority: value }))}
            onReqPriorityCommit={(value) =>
              setAppliedFilters((prev) => ({ ...prev, reqPriority: value }))
            }
            onReqVersionChange={(value) => setFilters((prev) => ({ ...prev, reqVersion: value }))}
            onReqVersionCommit={(value) =>
              setAppliedFilters((prev) => ({ ...prev, reqVersion: value }))
            }
            onReqOwnerChange={(value) => setFilters((prev) => ({ ...prev, reqOwner: value }))}
            onReqOwnerCommit={(value) =>
              setAppliedFilters((prev) => ({ ...prev, reqOwner: value }))
            }
            onCreate={() => openModal("requirement", "create")}
            viewMode={viewMode.requirements}
            onViewModeChange={(mode) => toggleViewMode("requirements", mode)}
            loadingRequirements={loadingRequirements}
            filteredRequirementsLength={filteredRequirements.length}
            requirementFilterActive={requirementFilterActive}
            requirementPage={requirementPage}
            priorityLabel={priorityLabel}
            requirementStatusLabel={requirementStatusLabel}
            versionNameMap={versionNameMap}
            labelOf={labelOf}
            onEdit={(item) => openModal("requirement", "edit", item)}
            onDelete={deleteRequirement}
            paginationSize={pagination.requirements.size}
            onPageChange={(next) =>
              setPagination((prev) => ({
                ...prev,
                requirements: { ...prev.requirements, page: next }
              }))
            }
            onSizeChange={(next) =>
              setPagination((prev) => ({
                ...prev,
                requirements: { page: 1, size: next }
              }))
            }
          />
        )}
        {activeMenu === "tasks" && (
          <TasksPage
            handleFilterSubmit={handleFilterSubmit}
            filters={filters}
            productOptions={productOptions}
            moduleOptions={getModuleOptions(filters.taskProduct)}
            taskStatusFilterOptions={taskStatusFilterOptions}
            onTaskProductChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                taskProduct: value,
                taskModule: "全部"
              }))
            }
            onTaskProductCommit={(value) =>
              setAppliedFilters((prev) => ({
                ...prev,
                taskProduct: value,
                taskModule: "全部"
              }))
            }
            onTaskModuleChange={(value) => setFilters((prev) => ({ ...prev, taskModule: value }))}
            onTaskModuleCommit={(value) =>
              setAppliedFilters((prev) => ({ ...prev, taskModule: value }))
            }
            onTaskStatusChange={(value) => setFilters((prev) => ({ ...prev, taskStatus: value }))}
            onTaskStatusCommit={(value) =>
              setAppliedFilters((prev) => ({ ...prev, taskStatus: value }))
            }
            onTaskOwnerChange={(value) => setFilters((prev) => ({ ...prev, taskOwner: value }))}
            onTaskOwnerCommit={(value) =>
              setAppliedFilters((prev) => ({ ...prev, taskOwner: value }))
            }
            onTaskDueChange={(value) => setFilters((prev) => ({ ...prev, taskDue: value }))}
            onTaskDueCommit={(value) =>
              setAppliedFilters((prev) => ({ ...prev, taskDue: value }))
            }
            onCreate={() => openModal("task", "create")}
            viewMode={viewMode.tasks}
            onViewModeChange={(mode) => toggleViewMode("tasks", mode)}
            loadingTasks={loadingTasks}
            filteredTasksLength={filteredTasks.length}
            taskFilterActive={taskFilterActive}
            taskPage={taskPage}
            taskStatusLabel={taskStatusLabel}
            labelOf={labelOf}
            onEdit={(item) => openModal("task", "edit", item)}
            onDelete={deleteTask}
            paginationSize={pagination.tasks.size}
            onPageChange={(next) =>
              setPagination((prev) => ({
                ...prev,
                tasks: { ...prev.tasks, page: next }
              }))
            }
            onSizeChange={(next) =>
              setPagination((prev) => ({
                ...prev,
                tasks: { page: 1, size: next }
              }))
            }
          />
        )}
        {activeMenu === "dicts" && (
          <DictsPage
            dictTypeOptions={dictTypeOptions}
            selectedDictType={selectedDictType}
            setSelectedDictType={setSelectedDictType}
            dictTypeLabel={dictTypeLabel}
            onCreate={() => openModal("dict", "create")}
            loadingDicts={loadingDicts}
            dictItemsByTypeLength={dictItemsByType.length}
            dictPage={dictPage}
            draggingDictId={draggingDictId}
            dragOverDictId={dragOverDictId}
            onDragOverItem={setDragOverDictId}
            onDropItem={(targetId) => {
              if (draggingDictId) {
                reorderDictItems(draggingDictId, targetId);
              }
              setDraggingDictId(null);
              setDragOverDictId(null);
            }}
            onDragStartItem={setDraggingDictId}
            onDragEndItem={() => {
              setDraggingDictId(null);
              setDragOverDictId(null);
            }}
            onEdit={(item) => openModal("dict", "edit", item)}
            onDelete={deleteDict}
            gripIcon={<IconGrip />}
            paginationSize={pagination.dicts.size}
            onPageChange={(next) =>
              setPagination((prev) => ({
                ...prev,
                dicts: { ...prev.dicts, page: next }
              }))
            }
            onSizeChange={(next) =>
              setPagination((prev) => ({
                ...prev,
                dicts: { page: 1, size: next }
              }))
            }
          />
        )}

        {activeMenu === "reports" && (
          <ReportsPage versionStats={versionStats} requirements={requirements} />
        )}

        {activeMenu === "settings" && (
          <SettingsPage
            appName={appName}
            setAppName={setAppName}
            appIcon={appIcon}
            setAppIcon={setAppIcon}
          />
        )}

        {activeMenu === "menus" && (
          <MenusPage
            menuConfig={menuConfig}
            dragOverMenu={dragOverMenu}
            draggingMenu={draggingMenu}
            setDragOverMenu={setDragOverMenu}
            setDraggingMenu={setDraggingMenu}
            handleMenuDrop={handleMenuDrop}
            openMenuEdit={openMenuEdit}
            renderMenuIcon={renderMenuIcon}
            gripIcon={<IconGrip />}
          />
        )}
        <MenuEditModal
          target={menuEditTarget}
          setTarget={setMenuEditTarget}
          closeIcon={<IconClose />}
          onClose={() => setMenuEditTarget(null)}
          onSave={() => {
            if (!menuEditTarget) return;
            updateMenuLabel(menuEditTarget.key, menuEditTarget.label, menuEditTarget.parentKey);
            if (menuEditTarget.iconDataUrl !== undefined) {
              updateMenuIcon(
                menuEditTarget.key,
                menuEditTarget.iconDataUrl ?? null,
                menuEditTarget.parentKey
              );
            }
            setMenuEditTarget(null);
          }}
          onUploadFile={handleMenuIconFile}
          onSvgTextChange={handleMenuSvgText}
          renderIconByKey={(key) => menuIcons[key as keyof typeof menuIcons] ?? null}
          iconLibraryOpen={iconLibraryOpen}
          setIconLibraryOpen={setIconLibraryOpen}
          iconLibraryQuery={iconLibraryQuery}
          setIconLibraryQuery={setIconLibraryQuery}
          iconLibraryOptions={iconLibraryOptions}
        />
      </div>

      <EntityFormModal
        modal={modal}
        onClose={closeModal}
        onSave={handleModalSave}
        closeIcon={<IconClose />}
        productForm={productForm}
        setProductForm={setProductForm}
        moduleForm={moduleForm}
        setModuleForm={setModuleForm}
        versionForm={versionForm}
        setVersionForm={setVersionForm}
        requirementForm={requirementForm}
        setRequirementForm={setRequirementForm}
        taskForm={taskForm}
        setTaskForm={setTaskForm}
        dictForm={dictForm}
        setDictForm={setDictForm}
        productOptions={productOptions}
        moduleLevelOptions={moduleLevelOptions}
        parentModuleOptions={parentModuleOptions}
        productStatusOptions={productStatusOptions}
        versionStatusOptions={versionStatusOptions}
        priorityOptions={priorityOptions}
        versionOptionsForRequirementForm={versionOptionsForRequirementForm}
        requirementStatusOptions={requirementStatusOptions}
        dictTypeOptions={dictTypeOptions}
        taskStatusOptions={taskStatusOptions}
        getModuleOptions={getModuleOptions}
        getNextSortOrder={getNextSortOrder}
      />

      <DeleteConfirmModal
        open={Boolean(deleteConfirm)}
        label={deleteConfirm?.label}
        deleteSubmitting={deleteSubmitting}
        onClose={closeDeleteConfirm}
        onConfirm={() => void confirmDelete()}
        closeIcon={<IconClose />}
      />
    </AppShell>
  );
}
