import type { MenuKey } from "../types/domain";

export const pageMeta: Record<MenuKey, { title: string; subtitle: string }> = {
  overview: { title: "产品交付总览", subtitle: "版本节奏与研发资源概览" },
  products: { title: "产品管理", subtitle: "多产品研发矩阵与负责人维护" },
  modules: { title: "功能模块", subtitle: "模块层级与职责边界管理" },
  versions: { title: "版本管理", subtitle: "版本生命周期与里程碑" },
  requirements: { title: "需求管理", subtitle: "需求拆解与评审协作" },
  tasks: { title: "任务管理", subtitle: "研发任务跟踪与交付进度" },
  reports: { title: "数据报表", subtitle: "交付指标与风险洞察" },
  dicts: { title: "字典管理", subtitle: "字典配置与系统规则维护" },
  settings: { title: "应用设置", subtitle: "应用名称与图标配置" },
  menus: { title: "菜单管理", subtitle: "菜单层级、名称与图标维护" }
};
