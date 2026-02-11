import type { FormEvent } from "react";
import type { TaskItem } from "../../types/domain";
import type { SelectOption } from "../../components/form/CustomSelect";
import { CustomSelect } from "../../components/form/CustomSelect";
import { DateInput } from "../../components/form/DateInput";
import { Pagination } from "../../components/data/Pagination";
import { ViewToggle } from "../../components/data/ViewToggle";

type TaskFilters = {
  taskProduct: string;
  taskModule: string;
  taskStatus: string;
  taskOwner: string;
  taskDue: string;
};

type TaskPageData = {
  items: TaskItem[];
  total: number;
  page: number;
};

type TasksPageProps = {
  handleFilterSubmit: (event: FormEvent<HTMLFormElement>) => void;
  filters: TaskFilters;
  productOptions: SelectOption[];
  moduleOptions: SelectOption[];
  taskStatusFilterOptions: SelectOption[];
  onTaskProductChange: (value: string) => void;
  onTaskProductCommit: (value: string) => void;
  onTaskModuleChange: (value: string) => void;
  onTaskModuleCommit: (value: string) => void;
  onTaskStatusChange: (value: string) => void;
  onTaskStatusCommit: (value: string) => void;
  onTaskOwnerChange: (value: string) => void;
  onTaskOwnerCommit: (value: string) => void;
  onTaskDueChange: (value: string) => void;
  onTaskDueCommit: (value: string) => void;
  onCreate: () => void;
  viewMode: "table" | "list";
  onViewModeChange: (mode: "table" | "list") => void;
  loadingTasks: boolean;
  filteredTasksLength: number;
  taskFilterActive: boolean;
  taskPage: TaskPageData;
  taskStatusLabel: Record<string, string>;
  labelOf: (code: string | undefined, map: Record<string, string>) => string;
  onEdit: (item: TaskItem) => void;
  onDelete: (id?: number) => void;
  paginationSize: number;
  onPageChange: (next: number) => void;
  onSizeChange: (next: number) => void;
};

export function TasksPage({
  handleFilterSubmit,
  filters,
  productOptions,
  moduleOptions,
  taskStatusFilterOptions,
  onTaskProductChange,
  onTaskProductCommit,
  onTaskModuleChange,
  onTaskModuleCommit,
  onTaskStatusChange,
  onTaskStatusCommit,
  onTaskOwnerChange,
  onTaskOwnerCommit,
  onTaskDueChange,
  onTaskDueCommit,
  onCreate,
  viewMode,
  onViewModeChange,
  loadingTasks,
  filteredTasksLength,
  taskFilterActive,
  taskPage,
  taskStatusLabel,
  labelOf,
  onEdit,
  onDelete,
  paginationSize,
  onPageChange,
  onSizeChange
}: TasksPageProps) {
  return (
    <section className="section-block">
      <form className="section-filter" onSubmit={handleFilterSubmit}>
        <div className="filter-row compact">
          <div className="filter-field">
            <span className="filter-label">产品</span>
            <div className="filter-control">
              <CustomSelect
                className="compact"
                value={filters.taskProduct}
                options={[{ value: "全部", label: "全部" }, ...productOptions]}
                onChange={onTaskProductChange}
                onCommit={onTaskProductCommit}
              />
            </div>
          </div>
          <div className="filter-field">
            <span className="filter-label">模块</span>
            <div className="filter-control">
              <CustomSelect
                className="compact"
                value={filters.taskModule}
                options={[{ value: "全部", label: "全部" }, ...moduleOptions]}
                onChange={onTaskModuleChange}
                onCommit={onTaskModuleCommit}
              />
            </div>
          </div>
          <div className="filter-field">
            <span className="filter-label">状态</span>
            <div className="filter-control">
              <CustomSelect
                className="compact"
                value={filters.taskStatus}
                options={[{ value: "全部", label: "全部" }, ...taskStatusFilterOptions]}
                onChange={onTaskStatusChange}
                onCommit={onTaskStatusCommit}
              />
            </div>
          </div>
          <div className="filter-field">
            <span className="filter-label">负责人</span>
            <div className="filter-control">
              <input
                placeholder="负责人"
                value={filters.taskOwner}
                onChange={(event) => onTaskOwnerChange(event.target.value)}
                onBlur={(event) => onTaskOwnerCommit(event.target.value)}
              />
            </div>
          </div>
          <div className="filter-field">
            <span className="filter-label">截止时间</span>
            <DateInput
              className="filter-control"
              value={filters.taskDue}
              onChange={(event) => onTaskDueChange(event.target.value)}
              onCommit={onTaskDueCommit}
            />
          </div>
        </div>
      </form>
      <div className="section-content">
        <div className="section-toolbar">
          <button className="primary" onClick={onCreate}>
            新增任务
          </button>
          <ViewToggle value={viewMode} onChange={onViewModeChange} />
        </div>
        {loadingTasks && <div className="list-empty">正在加载任务...</div>}
        {!loadingTasks && filteredTasksLength === 0 && (
          <div className="list-empty">{taskFilterActive ? "暂无符合条件的任务" : "暂无任务数据"}</div>
        )}
        {viewMode === "table" ? (
          <div className="table-scroll">
            <div className="table wide cols-5">
              <div className="table-row header">
                <span>任务名称</span>
                <span>负责人</span>
                <span>截止时间</span>
                <span>状态</span>
                <span>操作</span>
              </div>
              {taskPage.items.map((item) => (
                <div className="table-row" key={item.id ?? item.title}>
                  <span>{item.title}</span>
                  <span>{item.assignee}</span>
                  <span>{item.dueDate ?? "-"}</span>
                  <span>{labelOf(item.status, taskStatusLabel)}</span>
                  <span className="table-actions">
                    <button className="ghost small" onClick={() => onEdit(item)}>
                      编辑
                    </button>
                    <button className="ghost small danger" onClick={() => onDelete(item.id)}>
                      删除
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="list">
            {taskPage.items.map((item) => (
              <div className="list-row" key={item.id ?? item.title}>
                <div>
                  <div className="list-title">{item.title}</div>
                  <div className="list-sub">负责人：{item.assignee}</div>
                </div>
                <div className="list-meta">
                  <span>{item.dueDate ?? "-"}</span>
                  <span className="pill alt">{labelOf(item.status, taskStatusLabel)}</span>
                  <button className="ghost small" onClick={() => onEdit(item)}>
                    编辑
                  </button>
                  <button className="ghost small danger" onClick={() => onDelete(item.id)}>
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {filteredTasksLength > 0 && (
          <Pagination
            page={taskPage.page}
            size={paginationSize}
            total={taskPage.total}
            onPageChange={onPageChange}
            onSizeChange={onSizeChange}
          />
        )}
      </div>
    </section>
  );
}
