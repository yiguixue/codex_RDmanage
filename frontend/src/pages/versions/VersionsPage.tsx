import type { FormEvent } from "react";
import type { Version } from "../../types/domain";
import type { SelectOption } from "../../components/form/CustomSelect";
import { CustomSelect } from "../../components/form/CustomSelect";
import { DateInput } from "../../components/form/DateInput";
import { ViewToggle } from "../../components/data/ViewToggle";
import { Pagination } from "../../components/data/Pagination";

type VersionFilters = {
  versionProduct: string;
  versionModule: string;
  versionStatus: string;
  versionOwner: string;
  versionDateStart: string;
  versionDateEnd: string;
};

type VersionPageData = {
  items: Version[];
  total: number;
  page: number;
};

export type VersionsPageProps = {
  handleFilterSubmit: (event: FormEvent<HTMLFormElement>) => void;
  filters: VersionFilters;
  productOptions: SelectOption[];
  moduleOptions: SelectOption[];
  versionStatusFilterOptions: SelectOption[];
  onVersionProductChange: (value: string) => void;
  onVersionProductCommit: (value: string) => void;
  onVersionModuleChange: (value: string) => void;
  onVersionModuleCommit: (value: string) => void;
  onVersionStatusChange: (value: string) => void;
  onVersionStatusCommit: (value: string) => void;
  onVersionOwnerChange: (value: string) => void;
  onVersionOwnerCommit: (value: string) => void;
  onVersionDateStartChange: (value: string) => void;
  onVersionDateStartCommit: (value: string) => void;
  onVersionDateEndChange: (value: string) => void;
  onVersionDateEndCommit: (value: string) => void;
  onCreate: () => void;
  viewMode: "table" | "list";
  onViewModeChange: (mode: "table" | "list") => void;
  loadingVersions: boolean;
  filteredVersionsLength: number;
  versionFilterActive: boolean;
  versionPage: VersionPageData;
  versionStatusLabel: Record<string, string>;
  labelOf: (code: string | undefined, map: Record<string, string>) => string;
  onEdit: (item: Version) => void;
  onDelete: (id?: number) => void;
  paginationSize: number;
  onPageChange: (next: number) => void;
  onSizeChange: (next: number) => void;
};

export function VersionsPage({
  handleFilterSubmit,
  filters,
  productOptions,
  moduleOptions,
  versionStatusFilterOptions,
  onVersionProductChange,
  onVersionProductCommit,
  onVersionModuleChange,
  onVersionModuleCommit,
  onVersionStatusChange,
  onVersionStatusCommit,
  onVersionOwnerChange,
  onVersionOwnerCommit,
  onVersionDateStartChange,
  onVersionDateStartCommit,
  onVersionDateEndChange,
  onVersionDateEndCommit,
  onCreate,
  viewMode,
  onViewModeChange,
  loadingVersions,
  filteredVersionsLength,
  versionFilterActive,
  versionPage,
  versionStatusLabel,
  labelOf,
  onEdit,
  onDelete,
  paginationSize,
  onPageChange,
  onSizeChange
}: VersionsPageProps) {
  return (
    <section className="section-block">
      <form className="section-filter" onSubmit={handleFilterSubmit}>
        <div className="filter-row compact">
          <div className="filter-field">
            <span className="filter-label">产品</span>
            <div className="filter-control">
              <CustomSelect
                className="compact"
                value={filters.versionProduct}
                options={[{ value: "全部", label: "全部" }, ...productOptions]}
                onChange={onVersionProductChange}
                onCommit={onVersionProductCommit}
              />
            </div>
          </div>
          <div className="filter-field">
            <span className="filter-label">模块</span>
            <div className="filter-control">
              <CustomSelect
                className="compact"
                value={filters.versionModule}
                options={[{ value: "全部", label: "全部" }, ...moduleOptions]}
                onChange={onVersionModuleChange}
                onCommit={onVersionModuleCommit}
              />
            </div>
          </div>
          <div className="filter-field">
            <span className="filter-label">状态</span>
            <div className="filter-control">
              <CustomSelect
                className="compact"
                value={filters.versionStatus}
                options={[{ value: "全部", label: "全部" }, ...versionStatusFilterOptions]}
                onChange={onVersionStatusChange}
                onCommit={onVersionStatusCommit}
              />
            </div>
          </div>
          <div className="filter-field">
            <span className="filter-label">负责人</span>
            <div className="filter-control">
              <input
                placeholder="负责人"
                value={filters.versionOwner}
                onChange={(event) => onVersionOwnerChange(event.target.value)}
                onBlur={(event) => onVersionOwnerCommit(event.target.value)}
              />
            </div>
          </div>
          <div className="filter-field range">
            <span className="filter-label">发布时间</span>
            <div className="filter-range">
              <DateInput
                className="filter-control"
                placeholder="开始日期"
                value={filters.versionDateStart}
                onChange={(event) => onVersionDateStartChange(event.target.value)}
                onCommit={onVersionDateStartCommit}
              />
              <span className="filter-sep">至</span>
              <DateInput
                className="filter-control"
                placeholder="结束日期"
                value={filters.versionDateEnd}
                onChange={(event) => onVersionDateEndChange(event.target.value)}
                onCommit={onVersionDateEndCommit}
              />
            </div>
          </div>
        </div>
      </form>
      <div className="section-content">
        <div className="section-toolbar">
          <button className="primary" onClick={onCreate}>
            新增版本
          </button>
          <ViewToggle value={viewMode} onChange={onViewModeChange} />
        </div>
        {loadingVersions && <div className="list-empty">正在加载版本...</div>}
        {!loadingVersions && filteredVersionsLength === 0 && (
          <div className="list-empty">{versionFilterActive ? "暂无符合条件的版本" : "暂无版本数据"}</div>
        )}
        {viewMode === "table" ? (
          <div className="table-scroll">
            <div className="table wide cols-6">
              <div className="table-row header">
                <span>版本号</span>
                <span>版本名称</span>
                <span>负责人</span>
                <span>计划发布</span>
                <span>状态</span>
                <span>操作</span>
              </div>
              {versionPage.items.map((item) => (
                <div className="table-row" key={item.id ?? item.versionCode}>
                  <span>{item.versionCode}</span>
                  <span>{item.name}</span>
                  <span>{item.owner}</span>
                  <span>{item.planReleaseDate}</span>
                  <span>{labelOf(item.status, versionStatusLabel)}</span>
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
            {versionPage.items.map((item) => (
              <div className="list-row" key={item.id ?? item.versionCode}>
                <div>
                  <div className="list-title">
                    {item.versionCode} · {item.name}
                  </div>
                  <div className="list-sub">负责人：{item.owner}</div>
                </div>
                <div className="list-meta">
                  <span>{item.planReleaseDate}</span>
                  <span className="pill">{labelOf(item.status, versionStatusLabel)}</span>
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
        {filteredVersionsLength > 0 && (
          <Pagination
            page={versionPage.page}
            size={paginationSize}
            total={versionPage.total}
            onPageChange={onPageChange}
            onSizeChange={onSizeChange}
          />
        )}
      </div>
    </section>
  );
}
