# 研发管理系统 - V1 框架说明

## 目标范围
- 版本管理：版本号、计划发布时间、负责人、状态等基础信息维护
- 需求管理：需求名称、编号、描述、优先级、关联版本、负责人、计划完成时间等
- 任务管理：需求拆解后的研发任务、负责人、完成时间等

## 后端结构（Java / Spring Boot）
- 模块入口：`backend/src/main/java/com/rdmanage/RdManageApplication.java`
- API Controller：
  - `backend/src/main/java/com/rdmanage/controller/VersionController.java`
  - `backend/src/main/java/com/rdmanage/controller/RequirementController.java`
  - `backend/src/main/java/com/rdmanage/controller/TaskController.java`
- In-Memory Service（占位）：
  - `backend/src/main/java/com/rdmanage/service/VersionService.java`
  - `backend/src/main/java/com/rdmanage/service/RequirementService.java`
  - `backend/src/main/java/com/rdmanage/service/TaskService.java`
- 领域模型：`backend/src/main/java/com/rdmanage/model/`
- 请求 DTO：`backend/src/main/java/com/rdmanage/dto/`

## API 规划（占位）
- 版本管理
  - `GET /api/versions`
  - `POST /api/versions`
  - `GET /api/versions/{id}`
  - `PUT /api/versions/{id}`
  - `DELETE /api/versions/{id}`
- 需求管理
  - `GET /api/requirements`
  - `POST /api/requirements`
  - `GET /api/requirements/{id}`
  - `PUT /api/requirements/{id}`
  - `DELETE /api/requirements/{id}`
- 任务管理
  - `GET /api/tasks`
  - `POST /api/tasks`
  - `GET /api/tasks/{id}`
  - `PUT /api/tasks/{id}`
  - `DELETE /api/tasks/{id}`

## 前端结构（React + TypeScript + Vite）
- 入口：`frontend/src/main.tsx`
- 页面：`frontend/src/App.tsx`
- 主题样式：`frontend/src/styles.css`

## 下一步建议
- 接入数据库（MySQL/PostgreSQL）并替换内存存储
- 加入用户/权限与组织结构
- 增加需求评审、里程碑、燃尽与工时统计
