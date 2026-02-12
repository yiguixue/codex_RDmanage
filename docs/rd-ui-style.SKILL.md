---
name: rd-ui-style
description: Design and implement UI in the user's preferred style (clean, youthful, low-saturation, Feishu-like) for product/management dashboards and CRUD apps. Use when building or refining UI layouts, typography, color, spacing, navigation, tables/lists, forms, modals, date pickers, and interactions to match this style.
---

# rd-ui-style

## 设计基调
- 清爽、年轻、低饱和度，参考飞书风格。
- 背景使用淡色渐变或柔和层次，不要纯白死板。
- 圆角、轻阴影、柔和边界，避免厚重边框与强对比。
- 视觉克制：少用高饱和颜色与紫色偏重配色。

## 字体与排版
- 标题紧凑、偏小：主标题约 20px。
- 说明文案 12–13px，色彩偏灰蓝。
- 行距与间距紧凑但不拥挤，整体轻薄。

## 布局与结构
- 左侧固定导航栏，右侧内容区滚动。
- 顶部标题栏可吸顶、轻微毛玻璃、弱透明。
- 版本/需求/任务页：上半筛选，下半表格或列表；默认表格，可切换列表。
- 操作列固定在表格最后，字段多时允许横向滚动。

## 导航栏
- 支持收起/展开；图标与标题位置稳定，不抖动。
- 菜单项使用统一线性图标。
- 二级菜单为“系统管理 > 字典管理”，折叠显示。

## 表格/列表
- 行背景为淡色块，hover 轻微上浮或变浅。
- 列表同样卡片化、柔和阴影。
- 切换图标放在工具栏右上角，风格统一。

## 表单与弹窗
- 必填项红色“*”。
- 弹窗底部固定保存按钮，表单内容可滚动。
- 弹窗关闭按钮用简洁图标。
- 输入框圆角、浅边框，风格统一。

## 日期选择
- 使用自定义日期面板，风格清爽；不要原生丑面板。
- 日期输入框可整体点击，占位为“年/月/日”；筛选为“开始日期/结束日期”。

## 滚动条
- 细、浅、圆角；淡蓝灰配色。
- 不要上下箭头。

## 交互与动效
- 侧栏收起/展开与切换动效使用平滑缓动（cubic-bezier）。
- Hover/Active 采用轻微颜色与阴影变化。

## 避免事项
- 不要出现占位文案或无业务意义文案。
- 不要高饱和、强对比、厚重边框。
- 不要使用默认系统字体堆栈。
