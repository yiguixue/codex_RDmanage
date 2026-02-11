type PageHeaderProps = {
  title: string;
  subtitle: string;
  tips?: string[];
};

export function PageHeader({ title, subtitle, tips = [] }: PageHeaderProps) {
  return (
    <header className="topbar">
      <div>
        <div className="page-title">{title}</div>
        <div className="page-sub">{subtitle}</div>
        {tips
          .filter(Boolean)
          .map((tip, index) => (
            <div key={`${tip}-${index}`} className="page-tip">
              {tip}
            </div>
          ))}
      </div>
    </header>
  );
}
