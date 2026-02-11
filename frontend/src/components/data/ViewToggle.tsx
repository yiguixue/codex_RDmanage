type ViewMode = "table" | "list";

type ViewToggleProps = {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
};

const IconTable = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M3 10h18M3 15h18M9 5v14M15 5v14" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const IconList = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 6h13M8 12h13M8 18h13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="4" cy="6" r="1.5" fill="currentColor" />
    <circle cx="4" cy="12" r="1.5" fill="currentColor" />
    <circle cx="4" cy="18" r="1.5" fill="currentColor" />
  </svg>
);

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="view-toggle">
      <button
        type="button"
        className={`icon-btn ${value === "table" ? "active" : ""}`}
        onClick={() => onChange("table")}
      >
        <IconTable />
      </button>
      <button
        type="button"
        className={`icon-btn ${value === "list" ? "active" : ""}`}
        onClick={() => onChange("list")}
      >
        <IconList />
      </button>
    </div>
  );
}
