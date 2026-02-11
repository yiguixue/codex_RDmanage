import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, MouseEvent as ReactMouseEvent } from "react";

type DateInputProps = {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
  onCommit?: (value: string) => void;
};

function parseDate(value: string) {
  if (!value) return null;
  const parts = value.split("-");
  if (parts.length !== 3) return null;
  const [year, month, day] = parts.map((part) => Number(part));
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function formatDate(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function DateInput({
  value,
  onChange,
  className,
  placeholder = "年/月/日",
  onCommit
}: DateInputProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => new Date());
  const [popoverStyle, setPopoverStyle] = useState<{ left: number; top: number } | null>(null);
  const isEmpty = !value;
  const classes = ["date-input", className, isEmpty ? "is-empty" : ""].filter(Boolean).join(" ");

  const updatePopoverPosition = () => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const popoverWidth = 260;
    const popoverHeight = 300;
    const padding = 12;
    let left = rect.left;
    if (left + popoverWidth > window.innerWidth - padding) {
      left = window.innerWidth - popoverWidth - padding;
    }
    left = Math.max(padding, left);
    let top = rect.bottom + 8;
    if (top + popoverHeight > window.innerHeight - padding) {
      top = rect.top - popoverHeight - 8;
    }
    top = Math.max(padding, top);
    setPopoverStyle({ left, top });
  };

  useEffect(() => {
    if (!open) return;
    const parsed = parseDate(value);
    setViewDate(parsed ?? new Date());
  }, [open, value]);

  useEffect(() => {
    if (!open) return;
    updatePopoverPosition();
    const handleClick = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleResize = () => updatePopoverPosition();
    document.addEventListener("mousedown", handleClick);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("resize", handleResize);
    };
  }, [open]);

  const handleMouseDown = (event: ReactMouseEvent) => {
    if (popoverRef.current && popoverRef.current.contains(event.target as Node)) {
      return;
    }
    event.preventDefault();
    if (!open) {
      setOpen(true);
      updatePopoverPosition();
      inputRef.current?.focus();
    }
  };

  const handleSelect = (date: Date) => {
    const next = formatDate(date);
    onChange({ target: { value: next } } as ChangeEvent<HTMLInputElement>);
    setOpen(false);
    setPopoverStyle(null);
    onCommit?.(next);
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthStart = new Date(year, month, 1);
  const firstWeekday = (monthStart.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: 42 }, (_, index) => {
    const day = index - firstWeekday + 1;
    if (day < 1 || day > daysInMonth) return null;
    return new Date(year, month, day);
  });

  const selected = parseDate(value);
  const today = new Date();
  const weekLabels = ["一", "二", "三", "四", "五", "六", "日"];

  return (
    <div className={classes} onMouseDown={handleMouseDown} ref={wrapRef}>
      <input ref={inputRef} type="text" value={value} onChange={onChange} readOnly />
      {isEmpty && <span className="date-placeholder">{placeholder}</span>}
      {open && (
        <div
          className="date-popover"
          style={popoverStyle ?? undefined}
          ref={popoverRef}
          onMouseDown={(event) => {
            event.stopPropagation();
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="date-header">
            <button
              type="button"
              className="date-nav"
              onClick={(event) => {
                event.stopPropagation();
                setViewDate(new Date(year, month - 1, 1));
              }}
            >
              ‹
            </button>
            <div className="date-title">{`${year}年 ${String(month + 1).padStart(2, "0")}月`}</div>
            <button
              type="button"
              className="date-nav"
              onClick={(event) => {
                event.stopPropagation();
                setViewDate(new Date(year, month + 1, 1));
              }}
            >
              ›
            </button>
          </div>
          <div className="date-week">
            {weekLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
          <div className="date-grid">
            {cells.map((date, index) => {
              if (!date) return <span key={`empty-${index}`} className="date-cell empty" />;
              const isSelected =
                selected &&
                selected.getFullYear() === date.getFullYear() &&
                selected.getMonth() === date.getMonth() &&
                selected.getDate() === date.getDate();
              const isToday =
                today.getFullYear() === date.getFullYear() &&
                today.getMonth() === date.getMonth() &&
                today.getDate() === date.getDate();
              return (
                <button
                  type="button"
                  key={formatDate(date)}
                  className={`date-cell ${isSelected ? "selected" : ""} ${isToday ? "today" : ""}`}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleSelect(date);
                  }}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
