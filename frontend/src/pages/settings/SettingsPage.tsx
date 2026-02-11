export type SettingsPageProps = {
  appName: string;
  setAppName: (value: string) => void;
  appIcon: string | null;
  setAppIcon: (value: string | null) => void;
};

export function SettingsPage({ appName, setAppName, appIcon, setAppIcon }: SettingsPageProps) {
  return (
    <section className="section-block">
      <div className="settings-grid">
        <div className="card settings-card">
          <div className="card-head">
            <div>
              <div className="card-title">应用名称</div>
              <div className="card-sub">最多 20 个字符</div>
            </div>
          </div>
          <label className="settings-field">
            <span className="label-text">名称</span>
            <input
              value={appName}
              maxLength={20}
              onChange={(event) => setAppName(event.target.value)}
              placeholder="请输入应用名称"
            />
          </label>
          <div className="settings-tip">当前：{appName || "未设置"}</div>
        </div>

        <div className="card settings-card">
          <div className="card-head">
            <div>
              <div className="card-title">应用图标</div>
              <div className="card-sub">建议正方形、浅色背景</div>
            </div>
          </div>
          <div className="icon-uploader">
            <div className="icon-preview">{appIcon ? <img src={appIcon} alt="应用图标预览" /> : <span>RD</span>}</div>
            <div className="icon-actions">
              <label className="ghost small">
                上传图标
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => setAppIcon(String(reader.result));
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
              {appIcon && (
                <button className="ghost small danger" onClick={() => setAppIcon(null)}>
                  清除
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
