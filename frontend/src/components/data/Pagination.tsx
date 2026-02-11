export const pageSizeOptions = [10, 20, 50];

export const getTotalPages = (total: number, size: number) => Math.max(1, Math.ceil(total / size));

export const paginateItems = <T,>(items: T[], page: number, size: number) => {
  const total = items.length;
  const totalPages = getTotalPages(total, size);
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * size;
  return {
    items: items.slice(start, start + size),
    total,
    totalPages,
    page: safePage
  };
};

type PaginationProps = {
  page: number;
  size: number;
  total: number;
  onPageChange: (next: number) => void;
  onSizeChange: (next: number) => void;
};

export function Pagination({ page, size, total, onPageChange, onSizeChange }: PaginationProps) {
  const totalPages = getTotalPages(total, size);
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  const pages = Array.from({ length: end - start + 1 }, (_, idx) => start + idx);

  return (
    <div className="pagination">
      <div className="pagination-info">共 {total} 条</div>
      <div className="pagination-controls">
        <button
          type="button"
          className="pagination-btn"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          上一页
        </button>
        <div className="pagination-pages">
          {pages.map((item) => (
            <button
              key={item}
              type="button"
              className={`pagination-page ${item === page ? "active" : ""}`}
              onClick={() => onPageChange(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="pagination-btn"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          下一页
        </button>
        <div className="pagination-size">
          <span>每页</span>
          <select value={size} onChange={(event) => onSizeChange(Number(event.target.value))}>
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option} 条
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
