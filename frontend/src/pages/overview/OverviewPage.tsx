import type { Requirement, TaskItem, Version } from "../../types/domain";

type OverviewStats = {
  total: number;
  highPriority: number;
  pendingTasks: number;
  risks: number;
};

type OverviewPageProps = {
  versionStats: OverviewStats;
  loadingVersions: boolean;
  versions: Version[];
  loadingTasks: boolean;
  tasks: TaskItem[];
  loadingRequirements: boolean;
  requirements: Requirement[];
  versionStatusLabel: Record<string, string>;
  taskStatusLabel: Record<string, string>;
  priorityLabel: Record<string, string>;
  onNavigate: (menu: "versions" | "requirements" | "tasks" | "reports") => void;
};

function labelOf(value: string | undefined, labels: Record<string, string>) {
  if (!value) return "";
  return labels[value] ?? value;
}

export function OverviewPage({
  versionStats,
  loadingVersions,
  versions,
  loadingTasks,
  tasks,
  loadingRequirements,
  requirements,
  versionStatusLabel,
  taskStatusLabel,
  priorityLabel,
  onNavigate
}: OverviewPageProps) {
  return (
    <div className="page-scroll">
      <section className="grid stats">
        <button className="card stat clickable" type="button" onClick={() => onNavigate("versions")}>
          <div className="stat-label">进行中版本</div>
          <div className="stat-value">{versionStats.total}</div>
          <div className="stat-meta">规划/评审阶段</div>
        </button>
        <button className="card stat clickable" type="button" onClick={() => onNavigate("requirements")}>
          <div className="stat-label">高优需求</div>
          <div className="stat-value">{versionStats.highPriority}</div>
          <div className="stat-meta">优先级 HIGH/URGENT</div>
        </button>
        <button className="card stat clickable" type="button" onClick={() => onNavigate("tasks")}>
          <div className="stat-label">未完成任务</div>
          <div className="stat-value">{versionStats.pendingTasks}</div>
          <div className="stat-meta">进行中与待开始</div>
        </button>
        <button className="card stat clickable" type="button" onClick={() => onNavigate("reports")}>
          <div className="stat-label">阻塞风险</div>
          <div className="stat-value">{versionStats.risks}</div>
          <div className="stat-meta">BLOCKED 任务</div>
        </button>
      </section>

      <section className="overview-columns">
        <div className="overview-col">
          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">版本概览</div>
                <div className="card-sub">计划发布与负责人</div>
              </div>
              <button className="ghost small" onClick={() => onNavigate("versions")}>
                查看
              </button>
            </div>
            <div className="list">
              {loadingVersions && <div className="list-empty">正在加载版本...</div>}
              {!loadingVersions && versions.length === 0 && <div className="list-empty">暂无版本数据</div>}
              {versions.map((item) => (
                <button
                  type="button"
                  className="list-row clickable"
                  key={item.id ?? item.versionCode}
                  onClick={() => onNavigate("versions")}
                >
                  <div>
                    <div className="list-title">
                      {item.versionCode} · {item.name}
                    </div>
                    <div className="list-sub">负责人：{item.owner}</div>
                  </div>
                  <div className="list-meta">
                    <span>{item.planReleaseDate}</span>
                    <span className="pill">{labelOf(item.status, versionStatusLabel)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">任务概览</div>
                <div className="card-sub">当前任务与负责人</div>
              </div>
              <button className="ghost small" onClick={() => onNavigate("tasks")}>
                查看
              </button>
            </div>
            <div className="list">
              {loadingTasks && <div className="list-empty">正在加载任务...</div>}
              {!loadingTasks && tasks.length === 0 && <div className="list-empty">暂无任务数据</div>}
              {tasks.map((item) => (
                <button
                  type="button"
                  className="list-row clickable"
                  key={item.id ?? item.title}
                  onClick={() => onNavigate("tasks")}
                >
                  <div>
                    <div className="list-title">{item.title}</div>
                    <div className="list-sub">负责人：{item.assignee}</div>
                  </div>
                  <div className="list-meta">
                    <span>{item.dueDate ?? "-"}</span>
                    <span className="pill alt">{labelOf(item.status, taskStatusLabel)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overview-col">
          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">需求概览</div>
                <div className="card-sub">关键需求与负责人</div>
              </div>
              <button className="ghost small" onClick={() => onNavigate("requirements")}>
                查看
              </button>
            </div>
            <div className="list">
              {loadingRequirements && <div className="list-empty">正在加载需求...</div>}
              {!loadingRequirements && requirements.length === 0 && <div className="list-empty">暂无需求数据</div>}
              {requirements.map((item) => (
                <button
                  type="button"
                  className="list-row clickable"
                  key={item.id ?? item.code}
                  onClick={() => onNavigate("requirements")}
                >
                  <div>
                    <div className="list-title">{item.name}</div>
                    <div className="list-sub">
                      {item.code} · 版本 {item.versionId ?? "-"}
                    </div>
                  </div>
                  <div className="list-meta">
                    <span className="priority">{labelOf(item.priority, priorityLabel)}</span>
                    <span>{item.owner}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">数据快照</div>
                <div className="card-sub">交付质量与风险</div>
              </div>
            </div>
            <div className="list">
              <div className="list-row">
                <div>
                  <div className="list-title">阻塞任务</div>
                  <div className="list-sub">当前阻塞数量</div>
                </div>
                <div className="list-meta">
                  <span className="pill alt">{versionStats.risks}</span>
                </div>
              </div>
              <div className="list-row">
                <div>
                  <div className="list-title">高优需求</div>
                  <div className="list-sub">优先级 HIGH/URGENT</div>
                </div>
                <div className="list-meta">
                  <span className="pill">{versionStats.highPriority}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
