import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { Product } from "../../types/domain";
import type { SelectOption } from "../../components/form/CustomSelect";
import { CustomSelect } from "../../components/form/CustomSelect";
import { Pagination } from "../../components/data/Pagination";
import { ViewToggle } from "../../components/data/ViewToggle";

type ProductFilterState = {
  status: string;
  owner: string;
  keyword: string;
};

type ProductPageData = {
  items: Product[];
  total: number;
  page: number;
};

type ProductsPageProps = {
  productFilters: ProductFilterState;
  setProductFilters: Dispatch<SetStateAction<ProductFilterState>>;
  setAppliedProductFilters: Dispatch<SetStateAction<ProductFilterState>>;
  productStatusOptions: SelectOption[];
  handleProductFilterSubmit: (event: FormEvent<HTMLFormElement>) => void;
  openModal: (type: "product", mode: "create" | "edit", data?: Product) => void;
  deleteProduct: (id?: number) => void;
  viewMode: "table" | "list";
  toggleViewMode: (mode: "table" | "list") => void;
  productError: string;
  loadingProducts: boolean;
  filteredProductsLength: number;
  productFilterActive: boolean;
  productPage: ProductPageData;
  paginationSize: number;
  onPageChange: (next: number) => void;
  onSizeChange: (next: number) => void;
};

export function ProductsPage({
  productFilters,
  setProductFilters,
  setAppliedProductFilters,
  productStatusOptions,
  handleProductFilterSubmit,
  openModal,
  deleteProduct,
  viewMode,
  toggleViewMode,
  productError,
  loadingProducts,
  filteredProductsLength,
  productFilterActive,
  productPage,
  paginationSize,
  onPageChange,
  onSizeChange
}: ProductsPageProps) {
  return (
    <section className="section-block">
      <form className="section-filter" onSubmit={handleProductFilterSubmit}>
        <div className="filter-row compact">
          <div className="filter-field">
            <span className="filter-label">状态</span>
            <div className="filter-control">
              <CustomSelect
                className="compact"
                value={productFilters.status}
                options={[{ value: "全部", label: "全部" }, ...productStatusOptions]}
                onChange={(value) => setProductFilters((prev) => ({ ...prev, status: value }))}
                onCommit={(value) => setAppliedProductFilters((prev) => ({ ...prev, status: value }))}
              />
            </div>
          </div>
          <div className="filter-field">
            <span className="filter-label">负责人</span>
            <div className="filter-control">
              <input
                placeholder="负责人"
                value={productFilters.owner}
                onChange={(event) => setProductFilters((prev) => ({ ...prev, owner: event.target.value }))}
                onBlur={(event) => setAppliedProductFilters((prev) => ({ ...prev, owner: event.target.value }))}
              />
            </div>
          </div>
          <div className="filter-field">
            <span className="filter-label">产品</span>
            <div className="filter-control">
              <input
                placeholder="产品名称/编码"
                value={productFilters.keyword}
                onChange={(event) => setProductFilters((prev) => ({ ...prev, keyword: event.target.value }))}
                onBlur={(event) =>
                  setAppliedProductFilters((prev) => ({ ...prev, keyword: event.target.value }))
                }
              />
            </div>
          </div>
        </div>
      </form>
      <div className="section-content">
        <div className="section-toolbar">
          <button className="primary" onClick={() => openModal("product", "create")}>
            新增产品
          </button>
          <ViewToggle value={viewMode} onChange={toggleViewMode} />
        </div>
        {productError && <div className="list-empty">{productError}</div>}
        {loadingProducts && <div className="list-empty">正在加载产品...</div>}
        {!loadingProducts && filteredProductsLength === 0 && (
          <div className="list-empty">{productFilterActive ? "暂无符合条件的产品" : "暂无产品数据"}</div>
        )}
        {viewMode === "table" ? (
          <div className="table-scroll">
            <div className="table wider cols-6">
              <div className="table-row header">
                <span>产品编码</span>
                <span>产品名称</span>
                <span>负责人</span>
                <span>状态</span>
                <span>描述</span>
                <span>操作</span>
              </div>
              {productPage.items.map((item) => (
                <div className="table-row" key={item.id ?? item.code}>
                  <span>{item.code}</span>
                  <span>{item.name}</span>
                  <span>{item.owner}</span>
                  <span>{item.status === "ACTIVE" ? "启用" : "停用"}</span>
                  <span>{item.description ?? "-"}</span>
                  <span className="table-actions">
                    <button className="ghost small" onClick={() => openModal("product", "edit", item)}>
                      编辑
                    </button>
                    <button className="ghost small danger" onClick={() => deleteProduct(item.id)}>
                      删除
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="list">
            {productPage.items.map((item) => (
              <div className="list-row" key={item.id ?? item.code}>
                <div>
                  <div className="list-title">
                    {item.code} · {item.name}
                  </div>
                  <div className="list-sub">负责人：{item.owner}</div>
                </div>
                <div className="list-meta">
                  <span>{item.status === "ACTIVE" ? "启用" : "停用"}</span>
                  <button className="ghost small" onClick={() => openModal("product", "edit", item)}>
                    编辑
                  </button>
                  <button className="ghost small danger" onClick={() => deleteProduct(item.id)}>
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {filteredProductsLength > 0 && (
          <Pagination
            page={productPage.page}
            size={paginationSize}
            total={productPage.total}
            onPageChange={onPageChange}
            onSizeChange={onSizeChange}
          />
        )}
      </div>
    </section>
  );
}
