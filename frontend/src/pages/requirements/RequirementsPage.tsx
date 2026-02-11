import type { FormEvent } from "react";
import type { Requirement, Version } from "../../types/domain";
import type { SelectOption } from "../../components/form/CustomSelect";
import { CustomSelect } from "../../components/form/CustomSelect";
import { ViewToggle } from "../../components/data/ViewToggle";
import { Pagination } from "../../components/data/Pagination";

type RequirementFilters = {
  reqProduct: string;
  reqModule: string;
  reqPriority: string;
  reqVersion: string;
  reqOwner: string;
};

type RequirementPageData = {
  items: Requirement[];
  total: number;
  page: number;
};

type RequirementsPageProps = {
  selectedVersionId: string;
  setSelectedVersionId: (value: string) => void;
  versionsForRequirement: Version[];
  handleFilterSubmit: (event: FormEvent<HTMLFormElement>) => void;
  filters: RequirementFilters;
  productOptions: SelectOption[];
  priorityFilterOptions: SelectOption[];
  moduleOptions: SelectOption[];
  onReqProductChange: (value: string) => void;
  onReqProductCommit: (value: string) => void;
  onReqModuleChange: (value: string) => void;
  onReqModuleCommit: (value: string) => void;
  onReqPriorityChange: (value: string) => void;
  onReqPriorityCommit: (value: string) => void;
  onReqVersionChange: (value: string) => void;
  onReqVersionCommit: (value: string) => void;
  onReqOwnerChange: (value: string) => void;
  onReqOwnerCommit: (value: string) => void;
  onCreate: () => void;
  viewMode: "table" | "list";
  onViewModeChange: (mode: "table" | "list") => void;
  loadingRequirements: boolean;
  filteredRequirementsLength: number;
  requirementFilterActive: boolean;
  requirementPage: RequirementPageData;
  priorityLabel: Record<string, string>;
  requirementStatusLabel: Record<string, string>;
  versionNameMap: Record<string, string>;
  labelOf: (code: string | undefined, map: Record<string, string>) => string;
  onEdit: (item: Requirement) => void;
  onDelete: (id?: number) => void;
  paginationSize: number;
  onPageChange: (next: number) => void;
  onSizeChange: (next: number) => void;
};

export function RequirementsPage({
  selectedVersionId,
  setSelectedVersionId,
  versionsForRequirement,
  handleFilterSubmit,
  filters,
  productOptions,
  priorityFilterOptions,
  moduleOptions,
  onReqProductChange,
  onReqProductCommit,
  onReqModuleChange,
  onReqModuleCommit,
  onReqPriorityChange,
  onReqPriorityCommit,
  onReqVersionChange,
  onReqVersionCommit,
  onReqOwnerChange,
  onReqOwnerCommit,
  onCreate,
  viewMode,
  onViewModeChange,
  loadingRequirements,
  filteredRequirementsLength,
  requirementFilterActive,
  requirementPage,
  priorityLabel,
  requirementStatusLabel,
  versionNameMap,
  labelOf,
  onEdit,
  onDelete,
  paginationSize,
  onPageChange,
  onSizeChange
}: RequirementsPageProps) {
  return (
    <section className="section-block requirements-section">
      <div className="split-layout requirements-layout">
        <div className="split-left card">
          <div className="card-head">
            <div>
              <div className="card-title">版本列表</div>
              <div className="card-sub">点击查看对应需求</div>
            </div>
          </div>
          <div className="version-list">
            <button
              type="button"
              className={`version-item ${selectedVersionId === "全部" ? "active" : ""}`}
              onClick={() => setSelectedVersionId("全部")}
            >
              <div className="version-title">全部版本</div>
              <div className="version-sub">展示所有需求</div>
            </button>
            {versionsForRequirement.map((item) => (
              <button
                key={item.id ?? item.versionCode}
                type="button"
                className={`version-item ${selectedVersionId === String(item.id ?? "") ? "active" : ""}`}
                onClick={() => setSelectedVersionId(String(item.id ?? ""))}
              >
                <div className="version-title">{item.versionCode}</div>
                <div className="version-sub">{item.name}</div>
                {item.description && <div className="version-desc">{item.description}</div>}
              </button>
            ))}
          </div>
        </div>
        <div className="split-right">
          <form className="section-filter" onSubmit={handleFilterSubmit}>
            <div className="filter-row compact">
              <div className="filter-field">
                <span className="filter-label">产品</span>
                <div className="filter-control">
                  <CustomSelect
                    className="compact"
                    value={filters.reqProduct}
                    options={[{ value: "全部", label: "全部" }, ...productOptions]}
                    onChange={onReqProductChange}
                    onCommit={onReqProductCommit}
                  />
                </div>
              </div>
              <div className="filter-field">
                <span className="filter-label">模块</span>
                <div className="filter-control">
                  <CustomSelect
                    className="compact"
                    value={filters.reqModule}
                    options={[{ value: "全部", label: "全部" }, ...moduleOptions]}
                    onChange={onReqModuleChange}
                    onCommit={onReqModuleCommit}
                  />
                </div>
              </div>
              <div className="filter-field">
                <span className="filter-label">优先级</span>
                <div className="filter-control">
                  <CustomSelect
                    className="compact"
                    value={filters.reqPriority}
                    options={[{ value: "全部", label: "全部" }, ...priorityFilterOptions]}
                    onChange={onReqPriorityChange}
                    onCommit={onReqPriorityCommit}
                  />
                </div>
              </div>
              <div className="filter-field">
                <span className="filter-label">版本</span>
                <div className="filter-control">
                  <CustomSelect
                    className="compact"
                    value={filters.reqVersion}
                    options={[
                      { value: "全部", label: "全部" },
                      ...versionsForRequirement.map((item) => ({
                        value: String(item.id ?? ""),
                        label: item.versionCode
                      }))
                    ]}
                    onChange={onReqVersionChange}
                    onCommit={onReqVersionCommit}
                  />
                </div>
              </div>
              <div className="filter-field">
                <span className="filter-label">负责人</span>
                <div className="filter-control">
                  <input
                    placeholder="负责人"
                    value={filters.reqOwner}
                    onChange={(event) => onReqOwnerChange(event.target.value)}
                    onBlur={(event) => onReqOwnerCommit(event.target.value)}
                  />
                </div>
              </div>
            </div>
          </form>
          <div className="section-content">
            <div className="section-toolbar">
              <button className="primary" onClick={onCreate}>
                新增需求
              </button>
              <ViewToggle value={viewMode} onChange={onViewModeChange} />
            </div>
            {loadingRequirements && <div className="list-empty">正在加载需求...</div>}
            {!loadingRequirements && filteredRequirementsLength === 0 && (
              <div className="list-empty">{requirementFilterActive ? "暂无符合条件的需求" : "暂无需求数据"}</div>
            )}
            {viewMode === "table" ? (
              <div className="table-scroll">
                <div className="table wider cols-7">
                  <div className="table-row header">
                    <span>需求编号</span>
                    <span>需求名称</span>
                    <span>优先级</span>
                    <span>版本</span>
                    <span>负责人</span>
                    <span>状态</span>
                    <span>操作</span>
                  </div>
                  {requirementPage.items.map((item) => (
                    <div className="table-row" key={item.id ?? item.code}>
                      <span>{item.code}</span>
                      <span>{item.name}</span>
                      <span>{labelOf(item.priority, priorityLabel)}</span>
                      <span>{versionNameMap[String(item.versionId)] ?? String(item.versionId)}</span>
                      <span>{item.owner}</span>
                      <span>{labelOf(item.status, requirementStatusLabel)}</span>
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
                {requirementPage.items.map((item) => (
                  <div className="list-row" key={item.id ?? item.code}>
                    <div>
                      <div className="list-title">
                        {item.code} · {item.name}
                      </div>
                      <div className="list-sub">负责人：{item.owner}</div>
                    </div>
                    <div className="list-meta">
                      <span>{versionNameMap[String(item.versionId)] ?? String(item.versionId)}</span>
                      <span className="pill">{labelOf(item.priority, priorityLabel)}</span>
                      <span className="pill alt">{labelOf(item.status, requirementStatusLabel)}</span>
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
            {filteredRequirementsLength > 0 && (
              <Pagination
                page={requirementPage.page}
                size={paginationSize}
                total={requirementPage.total}
                onPageChange={onPageChange}
                onSizeChange={onSizeChange}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
