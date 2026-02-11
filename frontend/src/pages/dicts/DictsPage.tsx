import type { ReactNode } from "react";
import type { DictItem } from "../../types/domain";
import { Pagination } from "../../components/data/Pagination";

type DictPageData = {
  items: DictItem[];
  total: number;
  page: number;
};

type DictTypeOption = {
  value: string;
  label: string;
};

type DictsPageProps = {
  dictTypeOptions: DictTypeOption[];
  selectedDictType: string;
  setSelectedDictType: (value: string) => void;
  dictTypeLabel: Record<string, string>;
  onCreate: () => void;
  loadingDicts: boolean;
  dictItemsByTypeLength: number;
  dictPage: DictPageData;
  draggingDictId: number | null;
  dragOverDictId: number | null;
  onDragOverItem: (id: number) => void;
  onDropItem: (id: number) => void;
  onDragStartItem: (id: number) => void;
  onDragEndItem: () => void;
  onEdit: (item: DictItem) => void;
  onDelete: (id?: number) => void;
  gripIcon: ReactNode;
  paginationSize: number;
  onPageChange: (next: number) => void;
  onSizeChange: (next: number) => void;
};

export function DictsPage({
  dictTypeOptions,
  selectedDictType,
  setSelectedDictType,
  dictTypeLabel,
  onCreate,
  loadingDicts,
  dictItemsByTypeLength,
  dictPage,
  draggingDictId,
  dragOverDictId,
  onDragOverItem,
  onDropItem,
  onDragStartItem,
  onDragEndItem,
  onEdit,
  onDelete,
  gripIcon,
  paginationSize,
  onPageChange,
  onSizeChange
}: DictsPageProps) {
  return (
    <section className="section-block">
      <div className="system-grid dict-layout">
        <div className="system-panel module-panel">
          <div className="system-types">
            {dictTypeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`system-type ${selectedDictType === option.value ? "active" : ""}`}
                onClick={() => setSelectedDictType(option.value)}
              >
                <div className="system-type-title">{option.label}</div>
                <div className="system-type-sub">{option.value}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="system-panel">
          <div className="panel-head">
            <div>
              <div className="panel-title large">{dictTypeLabel[selectedDictType] ?? selectedDictType}</div>
              <div className="panel-sub">{selectedDictType}</div>
            </div>
            <button className="primary" onClick={onCreate}>
              新增字典
            </button>
          </div>
          {loadingDicts && <div className="list-empty">正在加载字典...</div>}
          {!loadingDicts && dictItemsByTypeLength === 0 && <div className="list-empty">暂无字典数据</div>}
          {dictItemsByTypeLength > 0 && (
            <>
              <div className="table-scroll">
                <div className="table wider cols-6">
                  <div className="table-row header">
                    <span></span>
                    <span>编码</span>
                    <span>名称</span>
                    <span>状态</span>
                    <span>备注</span>
                    <span>操作</span>
                  </div>
                  {dictPage.items.map((item) => (
                    <div
                      className={`table-row ${draggingDictId === item.id ? "dragging" : ""} ${dragOverDictId === item.id ? "drag-over" : ""}`}
                      key={item.id ?? item.dictCode}
                      onDragOver={(event) => {
                        event.preventDefault();
                        if (item.id) onDragOverItem(item.id);
                      }}
                      onDrop={() => {
                        if (item.id) onDropItem(item.id);
                      }}
                    >
                      <span
                        className="drag-handle"
                        title="拖动排序"
                        draggable={Boolean(item.id)}
                        onDragStart={() => item.id && onDragStartItem(item.id)}
                        onDragEnd={onDragEndItem}
                      >
                        {gripIcon}
                      </span>
                      <span>{item.dictCode}</span>
                      <span>{item.dictLabel}</span>
                      <span className={`pill ${item.isActive === 1 ? "" : "alt"}`}>
                        {item.isActive === 1 ? "启用" : "停用"}
                      </span>
                      <span>{item.remark ?? "-"}</span>
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
              <Pagination
                page={dictPage.page}
                size={paginationSize}
                total={dictPage.total}
                onPageChange={onPageChange}
                onSizeChange={onSizeChange}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
