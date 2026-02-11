import type { ReactNode } from "react";

type ModalDialogProps = {
  open: boolean;
  title: ReactNode;
  subtitle?: ReactNode;
  onClose: () => void;
  closeIcon?: ReactNode;
  className?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function ModalDialog({
  open,
  title,
  subtitle,
  onClose,
  closeIcon,
  className,
  children,
  footer
}: ModalDialogProps) {
  if (!open) return null;
  const hasBody = children !== null && children !== undefined && children !== false;

  return (
    <div className="modal-mask" role="dialog" aria-modal="true">
      <div className={`modal ${className ?? ""}`.trim()}>
        <div className="modal-head">
          <div>
            <div className="modal-title">{title}</div>
            {subtitle ? <div className="modal-sub">{subtitle}</div> : null}
          </div>
          <button className="icon-btn close-btn" onClick={onClose} aria-label="关闭">
            {closeIcon ?? "×"}
          </button>
        </div>
        {hasBody ? <div className="modal-body">{children}</div> : null}
        {footer ? <div className="modal-footer">{footer}</div> : null}
      </div>
    </div>
  );
}
