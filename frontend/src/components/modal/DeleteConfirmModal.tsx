import type { ReactNode } from "react";
import { ModalDialog } from "./ModalDialog";

type DeleteConfirmModalProps = {
  open: boolean;
  label?: string;
  deleteSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
  closeIcon: ReactNode;
};

export function DeleteConfirmModal({
  open,
  label,
  deleteSubmitting,
  onClose,
  onConfirm,
  closeIcon
}: DeleteConfirmModalProps) {
  return (
    <ModalDialog
      open={open}
      className="delete-confirm-modal"
      title={label ? `确认删除「${label}」？` : "确认删除该项？"}
      subtitle="删除后无法恢复，请谨慎执行"
      onClose={onClose}
      closeIcon={closeIcon}
      footer={
        <>
          <button className="ghost delete-cancel-btn" onClick={onClose} disabled={deleteSubmitting}>
            取消
          </button>
          <button className="ghost danger delete-confirm-btn" onClick={onConfirm} disabled={deleteSubmitting}>
            {deleteSubmitting ? "删除中..." : "删除"}
          </button>
        </>
      }
    />
  );
}
