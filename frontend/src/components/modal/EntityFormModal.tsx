import type { Dispatch, ReactNode, SetStateAction } from "react";
import type { DictItem, Product, ProductModule, Requirement, TaskItem, Version } from "../../types/domain";
import { DateInput } from "../form/DateInput";
import { CustomSelect, type SelectOption } from "../form/CustomSelect";
import { ModalDialog } from "./ModalDialog";

type ModalMode = "create" | "edit";
type ModalType = "product" | "module" | "version" | "requirement" | "task" | "dict" | null;

type ModalState = {
  type: ModalType;
  mode: ModalMode;
  data?: Version | Requirement | TaskItem | DictItem | Product | ProductModule;
};

type ProductForm = {
  code: string;
  name: string;
  owner: string;
  status: string;
  description: string;
};

type ModuleForm = {
  productId: string;
  parentId: string;
  level: string;
  code: string;
  name: string;
  owner: string;
  status: string;
  description: string;
};

type VersionForm = {
  productId: string;
  moduleId: string;
  versionCode: string;
  name: string;
  owner: string;
  planReleaseDate: string;
  status: string;
  description: string;
};

type RequirementForm = {
  productId: string;
  moduleId: string;
  code: string;
  name: string;
  priority: string;
  versionId: string;
  owner: string;
  status: string;
  dueDate: string;
  description: string;
};

type TaskForm = {
  productId: string;
  moduleId: string;
  title: string;
  requirementId: string;
  assignee: string;
  status: string;
  dueDate: string;
  description: string;
};

type DictForm = {
  dictType: string;
  dictCode: string;
  dictLabel: string;
  sortOrder: number;
  isActive: number;
  remark: string;
};

type EntityFormModalProps = {
  modal: ModalState;
  onClose: () => void;
  onSave: () => void;
  closeIcon: ReactNode;
  productForm: ProductForm;
  setProductForm: Dispatch<SetStateAction<ProductForm>>;
  moduleForm: ModuleForm;
  setModuleForm: Dispatch<SetStateAction<ModuleForm>>;
  versionForm: VersionForm;
  setVersionForm: Dispatch<SetStateAction<VersionForm>>;
  requirementForm: RequirementForm;
  setRequirementForm: Dispatch<SetStateAction<RequirementForm>>;
  taskForm: TaskForm;
  setTaskForm: Dispatch<SetStateAction<TaskForm>>;
  dictForm: DictForm;
  setDictForm: Dispatch<SetStateAction<DictForm>>;
  productOptions: SelectOption[];
  moduleLevelOptions: SelectOption[];
  parentModuleOptions: SelectOption[];
  productStatusOptions: SelectOption[];
  versionStatusOptions: SelectOption[];
  priorityOptions: SelectOption[];
  versionOptionsForRequirementForm: SelectOption[];
  requirementStatusOptions: SelectOption[];
  dictTypeOptions: SelectOption[];
  taskStatusOptions: SelectOption[];
  getModuleOptions: (productId: string, withIndent?: boolean) => SelectOption[];
  getNextSortOrder: (dictType: string) => number;
};

export function EntityFormModal({
  modal,
  onClose,
  onSave,
  closeIcon,
  productForm,
  setProductForm,
  moduleForm,
  setModuleForm,
  versionForm,
  setVersionForm,
  requirementForm,
  setRequirementForm,
  taskForm,
  setTaskForm,
  dictForm,
  setDictForm,
  productOptions,
  moduleLevelOptions,
  parentModuleOptions,
  productStatusOptions,
  versionStatusOptions,
  priorityOptions,
  versionOptionsForRequirementForm,
  requirementStatusOptions,
  dictTypeOptions,
  taskStatusOptions,
  getModuleOptions,
  getNextSortOrder
}: EntityFormModalProps) {
  return (
    <ModalDialog
      open={Boolean(modal.type)}
      title={
        <>
          {modal.mode === "create" ? "新增" : "编辑"}
          {modal.type === "product" && "产品"}
          {modal.type === "module" && "模块"}
          {modal.type === "version" && "版本"}
          {modal.type === "requirement" && "需求"}
          {modal.type === "task" && "任务"}
          {modal.type === "dict" && "字典"}
        </>
      }
      onClose={onClose}
      closeIcon={closeIcon}
      footer={
        <button className="primary full" onClick={onSave}>
          保存
        </button>
      }
    >
      {modal.type === "product" && (
        <div className="form-grid">
          <label>
            <span className="label-text">
              <span className="req">*</span>产品编码
            </span>
            <input
              value={productForm.code}
              onChange={(event) => setProductForm((prev) => ({ ...prev, code: event.target.value }))}
              placeholder="PROD-001"
              disabled={modal.mode === "edit"}
            />
          </label>
          <label>
            <span className="label-text">
              <span className="req">*</span>产品名称
            </span>
            <input
              value={productForm.name}
              onChange={(event) => setProductForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="请输入产品名称"
            />
          </label>
          <label>
            <span className="label-text">
              <span className="req">*</span>负责人
            </span>
            <input
              value={productForm.owner}
              onChange={(event) => setProductForm((prev) => ({ ...prev, owner: event.target.value }))}
              placeholder="负责人"
            />
          </label>
          <label>
            状态
            <CustomSelect
              value={productForm.status}
              options={productStatusOptions}
              onChange={(value) => setProductForm((prev) => ({ ...prev, status: value }))}
            />
          </label>
          <label className="full">
            描述
            <textarea
              rows={4}
              value={productForm.description}
              onChange={(event) => setProductForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="补充说明"
            />
          </label>
        </div>
      )}

      {modal.type === "module" && (
        <div className="form-grid two-col">
          <label>
            <span className="label-text">
              <span className="req">*</span>所属产品
            </span>
            <CustomSelect
              value={moduleForm.productId}
              placeholder="请选择产品"
              options={productOptions}
              onChange={(value) =>
                setModuleForm((prev) => ({
                  ...prev,
                  productId: value,
                  parentId: ""
                }))
              }
            />
          </label>
          <label>
            <span className="label-text">
              <span className="req">*</span>模块层级
            </span>
            <CustomSelect
              value={moduleForm.level}
              options={moduleLevelOptions}
              onChange={(value) => setModuleForm((prev) => ({ ...prev, level: value, parentId: "" }))}
            />
          </label>
          {Number(moduleForm.level || 1) > 1 && (
            <label>
              <span className="label-text">
                <span className="req">*</span>上级模块
              </span>
              <CustomSelect
                value={moduleForm.parentId}
                placeholder="请选择上级模块"
                options={parentModuleOptions}
                onChange={(value) => setModuleForm((prev) => ({ ...prev, parentId: value }))}
              />
            </label>
          )}
          <label>
            <span className="label-text">
              <span className="req">*</span>模块编码
            </span>
            <input
              value={moduleForm.code}
              onChange={(event) => setModuleForm((prev) => ({ ...prev, code: event.target.value }))}
              placeholder="MOD-001"
            />
          </label>
          <label>
            <span className="label-text">
              <span className="req">*</span>模块名称
            </span>
            <input
              value={moduleForm.name}
              onChange={(event) => setModuleForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="请输入模块名称"
            />
          </label>
          <label>
            负责人
            <input
              value={moduleForm.owner}
              onChange={(event) => setModuleForm((prev) => ({ ...prev, owner: event.target.value }))}
              placeholder="负责人"
            />
          </label>
          <label>
            状态
            <CustomSelect
              value={moduleForm.status}
              options={productStatusOptions}
              onChange={(value) => setModuleForm((prev) => ({ ...prev, status: value }))}
            />
          </label>
          <label className="full">
            描述
            <textarea
              rows={3}
              value={moduleForm.description}
              onChange={(event) => setModuleForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="补充说明"
            />
          </label>
        </div>
      )}

      {modal.type === "version" && (
        <div className="form-grid">
          <label>
            <span className="label-text">
              <span className="req">*</span>所属产品
            </span>
            <CustomSelect
              value={versionForm.productId}
              placeholder="请选择产品"
              options={productOptions}
              onChange={(value) => setVersionForm((prev) => ({ ...prev, productId: value, moduleId: "" }))}
            />
          </label>
          <label>
            <span className="label-text">
              <span className="req">*</span>功能模块
            </span>
            <CustomSelect
              value={versionForm.moduleId}
              placeholder="请选择模块"
              options={getModuleOptions(versionForm.productId, false)}
              onChange={(value) => setVersionForm((prev) => ({ ...prev, moduleId: value }))}
            />
          </label>
          <label>
            <span className="label-text">
              <span className="req">*</span>版本号
            </span>
            <input
              value={versionForm.versionCode}
              onChange={(event) => setVersionForm((prev) => ({ ...prev, versionCode: event.target.value }))}
              placeholder="RD-1.0"
              disabled={modal.mode === "edit"}
            />
          </label>
          <label>
            <span className="label-text">
              <span className="req">*</span>版本名称
            </span>
            <input
              value={versionForm.name}
              onChange={(event) => setVersionForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="请输入版本名称"
            />
          </label>
          <label>
            <span className="label-text">
              <span className="req">*</span>负责人
            </span>
            <input
              value={versionForm.owner}
              onChange={(event) => setVersionForm((prev) => ({ ...prev, owner: event.target.value }))}
              placeholder="负责人"
            />
          </label>
          <label>
            <span className="label-text">
              <span className="req">*</span>计划发布时间
            </span>
            <DateInput
              className="form-date"
              value={versionForm.planReleaseDate}
              onChange={(event) => setVersionForm((prev) => ({ ...prev, planReleaseDate: event.target.value }))}
            />
          </label>
          <label>
            状态
            <CustomSelect
              value={versionForm.status}
              options={versionStatusOptions}
              onChange={(value) => setVersionForm((prev) => ({ ...prev, status: value }))}
            />
          </label>
          <label className="full">
            描述
            <textarea
              rows={4}
              value={versionForm.description}
              onChange={(event) => setVersionForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="补充说明"
            />
          </label>
        </div>
      )}

      {modal.type === "requirement" && (
        <div className="form-grid two-col">
          <label>
            <span className="label-text">
              <span className="req">*</span>所属产品
            </span>
            <CustomSelect
              value={requirementForm.productId}
              placeholder="请选择产品"
              options={productOptions}
              onChange={(value) =>
                setRequirementForm((prev) => ({
                  ...prev,
                  productId: value,
                  moduleId: ""
                }))
              }
            />
          </label>
          <label>
            <span className="label-text">
              <span className="req">*</span>功能模块
            </span>
            <CustomSelect
              value={requirementForm.moduleId}
              placeholder="请选择模块"
              options={getModuleOptions(requirementForm.productId, false)}
              onChange={(value) => setRequirementForm((prev) => ({ ...prev, moduleId: value }))}
            />
          </label>
          <label className="full">
            <span className="label-text">
              <span className="req">*</span>需求名称
            </span>
            <input
              value={requirementForm.name}
              onChange={(event) => setRequirementForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="请输入需求名称"
            />
          </label>
          <label className="full">
            描述
            <textarea
              rows={4}
              value={requirementForm.description}
              onChange={(event) => setRequirementForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="补充说明"
            />
          </label>
          <label>
            <span className="label-text">
              <span className="req">*</span>需求编号
            </span>
            <input
              value={requirementForm.code}
              onChange={(event) => setRequirementForm((prev) => ({ ...prev, code: event.target.value }))}
              placeholder="REQ-1001"
              disabled={modal.mode === "edit"}
            />
          </label>
          <label>
            <span className="label-text">
              <span className="req">*</span>负责人
            </span>
            <input
              value={requirementForm.owner}
              onChange={(event) => setRequirementForm((prev) => ({ ...prev, owner: event.target.value }))}
              placeholder="负责人"
            />
          </label>
          <label>
            <span className="label-text">
              <span className="req">*</span>优先级
            </span>
            <CustomSelect
              value={requirementForm.priority}
              options={priorityOptions}
              onChange={(value) => setRequirementForm((prev) => ({ ...prev, priority: value }))}
            />
          </label>
          <label>
            <span className="label-text">
              <span className="req">*</span>关联版本
            </span>
            <CustomSelect
              value={requirementForm.versionId}
              placeholder="请选择版本"
              options={versionOptionsForRequirementForm}
              onChange={(value) => setRequirementForm((prev) => ({ ...prev, versionId: value }))}
            />
          </label>
          <label>
            状态
            <CustomSelect
              value={requirementForm.status}
              options={requirementStatusOptions}
              onChange={(value) => setRequirementForm((prev) => ({ ...prev, status: value }))}
            />
          </label>
          <label>
            计划完成
            <DateInput
              className="form-date"
              value={requirementForm.dueDate}
              onChange={(event) => setRequirementForm((prev) => ({ ...prev, dueDate: event.target.value }))}
            />
          </label>
        </div>
      )}

      {modal.type === "dict" && (
        <div className="form-grid two-col">
          <label>
            <span className="label-text">
              <span className="req">*</span>所属模块
            </span>
            <CustomSelect
              value={dictForm.dictType}
              options={dictTypeOptions}
              onChange={(value) =>
                setDictForm((prev) => ({
                  ...prev,
                  dictType: value,
                  sortOrder: getNextSortOrder(value)
                }))
              }
            />
          </label>
          <label>
            <span className="label-text">
              <span className="req">*</span>字典编码
            </span>
            <input
              value={dictForm.dictCode}
              onChange={(event) => setDictForm((prev) => ({ ...prev, dictCode: event.target.value }))}
              placeholder="例如: DRAFT"
            />
          </label>
          <label>
            <span className="label-text">
              <span className="req">*</span>字典名称
            </span>
            <input
              value={dictForm.dictLabel}
              onChange={(event) => setDictForm((prev) => ({ ...prev, dictLabel: event.target.value }))}
              placeholder="例如: 草稿"
            />
          </label>
          <label>
            状态
            <CustomSelect
              value={String(dictForm.isActive)}
              options={[
                { value: "1", label: "启用" },
                { value: "0", label: "停用" }
              ]}
              onChange={(value) => setDictForm((prev) => ({ ...prev, isActive: Number(value) }))}
            />
          </label>
          <label className="full">
            备注
            <textarea
              rows={3}
              value={dictForm.remark}
              onChange={(event) => setDictForm((prev) => ({ ...prev, remark: event.target.value }))}
              placeholder="补充说明"
            />
          </label>
        </div>
      )}

      {modal.type === "task" && (
        <div className="form-grid">
          <label>
            <span className="label-text">
              <span className="req">*</span>所属产品
            </span>
            <CustomSelect
              value={taskForm.productId}
              placeholder="请选择产品"
              options={productOptions}
              onChange={(value) => setTaskForm((prev) => ({ ...prev, productId: value, moduleId: "" }))}
            />
          </label>
          <label>
            <span className="label-text">
              <span className="req">*</span>功能模块
            </span>
            <CustomSelect
              value={taskForm.moduleId}
              placeholder="请选择模块"
              options={getModuleOptions(taskForm.productId, false)}
              onChange={(value) => setTaskForm((prev) => ({ ...prev, moduleId: value }))}
            />
          </label>
          <label>
            <span className="label-text">
              <span className="req">*</span>任务标题
            </span>
            <input
              value={taskForm.title}
              onChange={(event) => setTaskForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="请输入任务标题"
            />
          </label>
          <label>
            <span className="label-text">
              <span className="req">*</span>关联需求
            </span>
            <input
              value={taskForm.requirementId}
              onChange={(event) => setTaskForm((prev) => ({ ...prev, requirementId: event.target.value }))}
              placeholder="关联需求ID"
            />
          </label>
          <label>
            <span className="label-text">
              <span className="req">*</span>负责人
            </span>
            <input
              value={taskForm.assignee}
              onChange={(event) => setTaskForm((prev) => ({ ...prev, assignee: event.target.value }))}
              placeholder="负责人"
            />
          </label>
          <label>
            状态
            <CustomSelect
              value={taskForm.status}
              options={taskStatusOptions}
              onChange={(value) => setTaskForm((prev) => ({ ...prev, status: value }))}
            />
          </label>
          <label>
            截止时间
            <DateInput
              className="form-date"
              value={taskForm.dueDate}
              onChange={(event) => setTaskForm((prev) => ({ ...prev, dueDate: event.target.value }))}
            />
          </label>
          <label className="full">
            描述
            <textarea
              rows={4}
              value={taskForm.description}
              onChange={(event) => setTaskForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="补充说明"
            />
          </label>
        </div>
      )}
    </ModalDialog>
  );
}
