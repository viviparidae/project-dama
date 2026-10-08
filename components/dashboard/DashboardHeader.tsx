type DashboardHeaderProps = {
  title: string;
  subtitle: string;
};

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  return (
    <header className="header-card">
      <div className="header-title-row">
        <div className="header-titles">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>
    </header>
  );
}
