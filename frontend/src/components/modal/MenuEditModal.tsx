import type { Dispatch, ReactNode, SetStateAction } from "react";
import { ModalDialog } from "./ModalDialog";

type MenuEditTarget = {
  key: string;
  parentKey?: string;
  label: string;
  iconDataUrl?: string;
  iconKey?: string;
  svgText?: string;
};

type IconLibraryOption = {
  name: string;
  dataUrl: string;
};

type MenuEditModalProps = {
  target: MenuEditTarget | null;
  setTarget: Dispatch<SetStateAction<MenuEditTarget | null>>;
  closeIcon: ReactNode;
  onClose: () => void;
  onSave: () => void;
  onUploadFile: (file?: File) => Promise<void>;
  onSvgTextChange: (text: string) => void;
  renderIconByKey: (key: string) => ReactNode;
  iconLibraryOpen: boolean;
  setIconLibraryOpen: Dispatch<SetStateAction<boolean>>;
  iconLibraryQuery: string;
  setIconLibraryQuery: Dispatch<SetStateAction<string>>;
  iconLibraryOptions: IconLibraryOption[];
};

export function MenuEditModal({
  target,
  setTarget,
  closeIcon,
  onClose,
  onSave,
  onUploadFile,
  onSvgTextChange,
  renderIconByKey,
  iconLibraryOpen,
  setIconLibraryOpen,
  iconLibraryQuery,
  setIconLibraryQuery,
  iconLibraryOptions
}: MenuEditModalProps) {
  if (!target) {
    return null;
  }

  return (
    <ModalDialog
      open
      className="menu-modal"
      title="菜单设置"
      subtitle="修改菜单名称与图标"
      onClose={onClose}
      closeIcon={closeIcon}
      footer={
        <button
          className="primary"
          disabled={!target.label.trim() || !target.iconDataUrl}
          onClick={onSave}
        >
          保存
        </button>
      }
    >
      <div className="form-grid">
        <label>
          <span className="label-text">
            <span className="req">*</span>菜单名称
          </span>
          <input
            value={target.label}
            maxLength={20}
            onChange={(event) =>
              setTarget((prev) => (prev ? { ...prev, label: event.target.value } : prev))
            }
          />
        </label>
        <div className="menu-upload-block">
          <div className="menu-upload-title">
            <span className="req">*</span>菜单图标
          </div>
          <div className="menu-upload-intro">
            任选一种方式上传：拖拽/粘贴/选择文件，或从图标库选择，或粘贴 SVG 代码
          </div>
          <div
            className="menu-dropzone"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              void onUploadFile(event.dataTransfer.files?.[0]);
            }}
            onPaste={(event) => {
              const file = event.clipboardData.files?.[0];
              if (file) {
                void onUploadFile(file);
              } else {
                const text = event.clipboardData.getData("text/plain");
                if (text) onSvgTextChange(text);
              }
            }}
          >
            <div className="menu-drop-preview">
              {target.iconDataUrl ? (
                <img src={target.iconDataUrl} alt="图标预览" />
              ) : target.iconKey ? (
                <span className="menu-preview-icon">{renderIconByKey(target.iconKey)}</span>
              ) : (
                <span>PNG / SVG</span>
              )}
            </div>
            <div className="menu-drop-text">
              拖拽、粘贴或选择图标
              <label className="menu-upload">
                <span>选择文件</span>
                <input
                  type="file"
                  accept="image/png,image/svg+xml"
                  onChange={(event) => {
                    void onUploadFile(event.target.files?.[0]);
                  }}
                />
              </label>
            </div>
          </div>
          <div className="menu-icon-library">
            <button
              type="button"
              className="icon-library-trigger"
              onClick={() => setIconLibraryOpen((prev) => !prev)}
            >
              <span className="icon-library-preview">
                {target.iconDataUrl ? <img src={target.iconDataUrl} alt="当前图标" /> : <span>图标</span>}
              </span>
              <span>选择图标库</span>
              <span className="icon-library-arrow">{iconLibraryOpen ? "收起" : "展开"}</span>
            </button>
          </div>
          <label className="menu-svg-field">
            <span className="menu-svg-label">粘贴 SVG 代码（可选）</span>
            <textarea
              rows={3}
              placeholder="<svg ...>...</svg>"
              value={target.svgText ?? ""}
              onChange={(event) => onSvgTextChange(event.target.value)}
            />
          </label>
          {!target.iconDataUrl && <div className="menu-required-tip">请上传或粘贴图标</div>}
        </div>
      </div>
      {iconLibraryOpen && (
        <div className="icon-library-modal">
          <div className="icon-library-card">
            <div className="icon-library-head">
              <div className="icon-library-title">图标库</div>
              <button type="button" className="icon-btn close-btn" onClick={() => setIconLibraryOpen(false)}>
                {closeIcon}
              </button>
            </div>
            <div className="menu-icon-search">
              <input
                value={iconLibraryQuery}
                onChange={(event) => setIconLibraryQuery(event.target.value)}
                placeholder="搜索图标名称"
              />
            </div>
            <div className="menu-icon-grid">
              {iconLibraryOptions
                .filter((item) => item.name.toLowerCase().includes(iconLibraryQuery.trim().toLowerCase()))
                .map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    className={`menu-icon-option ${target.iconDataUrl === item.dataUrl ? "active" : ""}`}
                    onClick={() => {
                      setTarget((prev) => (prev ? { ...prev, iconDataUrl: item.dataUrl } : prev));
                      setIconLibraryOpen(false);
                    }}
                  >
                    <span className="menu-icon-thumb">
                      <img src={item.dataUrl} alt={item.name} />
                    </span>
                    <span className="menu-icon-name">{item.name}</span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </ModalDialog>
  );
}
