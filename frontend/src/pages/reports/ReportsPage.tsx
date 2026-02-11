import type { Requirement } from "../../types/domain";

type ReportStats = {
  highPriority: number;
  pendingTasks: number;
  risks: number;
};

type ReportsPageProps = {
  versionStats: ReportStats;
  requirements: Requirement[];
};

export function ReportsPage({ versionStats, requirements }: ReportsPageProps) {
  return (
    <div className="page-scroll">
      <section className="grid two overview-masonry">
        <div className="card overview-task">
          <div className="card-head">
            <div>
              <div className="card-title">交付风险</div>
              <div className="card-sub">阻塞与延期情况</div>
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
                <div className="list-title">未完成任务</div>
                <div className="list-sub">进行中与待开始</div>
              </div>
              <div className="list-meta">
                <span className="pill">{versionStats.pendingTasks}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="card overview-data">
          <div className="card-head">
            <div>
              <div className="card-title">需求完成度</div>
              <div className="card-sub">已完成与待处理</div>
            </div>
          </div>
          <div className="list">
            <div className="list-row">
              <div>
                <div className="list-title">已完成需求</div>
                <div className="list-sub">状态 DONE</div>
              </div>
              <div className="list-meta">
                <span className="pill">
                  {requirements.filter((item) => item.status === "DONE").length}
                </span>
              </div>
            </div>
            <div className="list-row">
              <div>
                <div className="list-title">高优需求</div>
                <div className="list-sub">HIGH / URGENT</div>
              </div>
              <div className="list-meta">
                <span className="pill alt">{versionStats.highPriority}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
