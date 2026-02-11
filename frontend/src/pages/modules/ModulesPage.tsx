import type { FormEvent } from "react";
import type { ProductModule } from "../../types/domain";
import type { SelectOption } from "../../components/form/CustomSelect";
import { CustomSelect } from "../../components/form/CustomSelect";
import { Pagination } from "../../components/data/Pagination";
import { ViewToggle } from "../../components/data/ViewToggle";

type ModulePageData = {
  items: ProductModule[];
  total: number;
  page: number;
};

type ModulesPageProps = {
  handleModuleFilterSubmit: (event: FormEvent<HTMLFormElement>) => void;
  selectedModuleProductId: string;
  setSelectedModuleProductId: (value: string) => void;
  moduleLevelFilter: string;
  setModuleLevelFilter: (value: string) => void;
  moduleStatusFilter: string;
  setModuleStatusFilter: (value: string) => void;
  productOptions: SelectOption[];
  moduleLevelOptions: SelectOption[];
  productStatusOptions: SelectOption[];
  openModal: (type: "module", mode: "create" | "edit", data?: ProductModule) => void;
  viewMode: "table" | "list";
  toggleViewMode: (mode: "table" | "list") => void;
  moduleError: string;
  loadingModules: boolean;
  filteredModulesLength: number;
  modulePage: ModulePageData;
  moduleLabelMap: Record<string, string>;
  productNameMap: Record<string, string>;
  deleteModule: (id?: number) => void;
  paginationSize: number;
  onPageChange: (next: number) => void;
  onSizeChange: (next: number) => void;
};

export function ModulesPage({
  handleModuleFilterSubmit,
  selectedModuleProductId,
  setSelectedModuleProductId,
  moduleLevelFilter,
  setModuleLevelFilter,
  moduleStatusFilter,
  setModuleStatusFilter,
  productOptions,
  moduleLevelOptions,
  productStatusOptions,
  openModal,
  viewMode,
  toggleViewMode,
  moduleError,
  loadingModules,
  filteredModulesLength,
  modulePage,
  moduleLabelMap,
  productNameMap,
  deleteModule,
  paginationSize,
  onPageChange,
  onSizeChange
}: ModulesPageProps) {
  return (
    <section className="section-block">
      <form className="section-filter" onSubmit={handleModuleFilterSubmit}>
        <div className="filter-row compact">
          <div className="filter-field">
            <span className="filter-label">产品</span>
            <div className="filter-control">
              <CustomSelect
                className="compact"
                value={selectedModuleProductId}
                options={[{ value: "全部", label: "全部" }, ...productOptions]}
                onChange={setSelectedModuleProductId}
                onCommit={setSelectedModuleProductId}
              />
            </div>
          </div>
          <div className="filter-field">
            <span className="filter-label">层级</span>
            <div className="filter-control">
              <CustomSelect
                className="compact"
                value={moduleLevelFilter}
                options={[{ value: "全部", label: "全部" }, ...moduleLevelOptions]}
                onChange={setModuleLevelFilter}
                onCommit={setModuleLevelFilter}
              />
            </div>
          </div>
          <div className="filter-field">
            <span className="filter-label">状态</span>
            <div className="filter-control">
              <CustomSelect
                className="compact"
                value={moduleStatusFilter}
                options={[{ value: "全部", label: "全部" }, ...productStatusOptions]}
                onChange={setModuleStatusFilter}
                onCommit={setModuleStatusFilter}
              />
            </div>
          </div>
        </div>
      </form>
      <div className="section-content">
        <div className="section-toolbar">
          <button className="primary" onClick={() => openModal("module", "create")}>
            新增模块
          </button>
          <ViewToggle value={viewMode} onChange={toggleViewMode} />
        </div>
        {moduleError && <div className="list-empty">{moduleError}</div>}
        {loadingModules && <div className="list-empty">正在加载模块...</div>}
        {!loadingModules && filteredModulesLength === 0 && <div className="list-empty">暂无模块数据</div>}
        {viewMode === "table" ? (
          <div className="table-scroll">
            <div className="table wider cols-8">
              <div className="table-row header">
                <span>模块编码</span>
                <span>模块名称</span>
                <span>层级</span>
                <span>上级模块</span>
                <span>所属产品</span>
                <span>负责人</span>
                <span>状态</span>
                <span>操作</span>
              </div>
              {modulePage.items.map((item) => (
                <div className="table-row" key={item.id ?? item.code}>
                  <span>{item.code}</span>
                  <span>{item.name}</span>
                  <span>{item.level}级</span>
                  <span>{item.parentId ? moduleLabelMap[String(item.parentId)] ?? "-" : "-"}</span>
                  <span>{productNameMap[String(item.productId)] ?? String(item.productId)}</span>
                  <span>{item.owner ?? "-"}</span>
                  <span>{item.status === "ACTIVE" ? "启用" : "停用"}</span>
                  <span className="table-actions">
                    <button className="ghost small" onClick={() => openModal("module", "edit", item)}>
                      编辑
                    </button>
                    <button className="ghost small danger" onClick={() => deleteModule(item.id)}>
                      删除
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="list">
            {modulePage.items.map((item) => (
              <div className="list-row" key={item.id ?? item.code}>
                <div>
                  <div className="list-title">
                    {item.code} · {item.name}
                  </div>
                  <div className="list-sub">
                    {productNameMap[String(item.productId)] ?? String(item.productId)} · {item.level}级
                  </div>
                </div>
                <div className="list-meta">
                  <span>{item.status === "ACTIVE" ? "启用" : "停用"}</span>
                  <button className="ghost small" onClick={() => openModal("module", "edit", item)}>
                    编辑
                  </button>
                  <button className="ghost small danger" onClick={() => deleteModule(item.id)}>
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {filteredModulesLength > 0 && (
          <Pagination
            page={modulePage.page}
            size={paginationSize}
            total={modulePage.total}
            onPageChange={onPageChange}
            onSizeChange={onSizeChange}
          />
        )}
      </div>
    </section>
  );
}
