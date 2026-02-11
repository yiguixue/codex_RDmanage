import { useEffect, useRef, useState } from "react";

export type SelectOption = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onCommit?: (value: string) => void;
};

export function CustomSelect({
  value,
  options,
  onChange,
  placeholder,
  className,
  onCommit
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const selected = options.find((item) => item.value === value);
  const [menuStyle, setMenuStyle] = useState<{ left: number; top: number; width: number } | null>(
    null
  );

  const updateMenuPosition = () => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const padding = 12;
    const menuWidth = Math.max(rect.width, 180);
    let left = rect.left;
    if (left + menuWidth > window.innerWidth - padding) {
      left = window.innerWidth - menuWidth - padding;
    }
    left = Math.max(padding, left);
    const top = rect.bottom + 8;
    setMenuStyle({ left, top, width: rect.width });
  };

  useEffect(() => {
    if (!open) return;
    updateMenuPosition();
    const handleClick = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleResize = () => updateMenuPosition();
    document.addEventListener("mousedown", handleClick);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("resize", handleResize);
    };
  }, [open]);

  return (
    <div className={`select ${className ?? ""}`} ref={wrapRef}>
      <button
        type="button"
        className="select-trigger"
        onMouseDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen((prev) => !prev);
          if (!open) updateMenuPosition();
        }}
      >
        <span className={selected ? "select-value" : "select-placeholder"}>
          {selected ? selected.label : placeholder ?? "请选择"}
        </span>
        <span className="select-caret" />
      </button>
      {open && (
        <div
          className="select-menu floating"
          style={menuStyle ?? undefined}
          onClick={(event) => event.stopPropagation()}
        >
          {options.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`select-option ${item.value === value ? "active" : ""}`}
              onMouseDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onChange(item.value);
                setOpen(false);
                onCommit?.(item.value);
              }}
              onClick={() => {
                // no-op: handled in onMouseDown to avoid flicker
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
