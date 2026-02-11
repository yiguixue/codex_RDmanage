import { type ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
  className?: string;
};

export function AppShell({ children, className }: AppShellProps) {
  return <div className={className ?? "app-shell"}>{children}</div>;
}
