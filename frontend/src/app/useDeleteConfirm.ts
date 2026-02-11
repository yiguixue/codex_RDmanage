import { useState } from "react";

export type DeleteEntityType = "product" | "module" | "version" | "requirement" | "task" | "dict";

export type DeleteConfirmState = {
  type: DeleteEntityType;
  id: number;
  label: string;
} | null;

type DeleteHandlers = Record<DeleteEntityType, (id: number) => Promise<void>>;

export function useDeleteConfirm(handlers: DeleteHandlers) {
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmState>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const requestDelete = (type: DeleteEntityType, id: number, label: string) => {
    setDeleteConfirm({ type, id, label });
  };

  const closeDeleteConfirm = () => {
    if (deleteSubmitting) return;
    setDeleteConfirm(null);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm || deleteSubmitting) return;
    setDeleteSubmitting(true);
    try {
      await handlers[deleteConfirm.type](deleteConfirm.id);
      setDeleteConfirm(null);
    } catch (error) {
      alert(String(error));
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return {
    deleteConfirm,
    deleteSubmitting,
    requestDelete,
    closeDeleteConfirm,
    confirmDelete
  };
}
