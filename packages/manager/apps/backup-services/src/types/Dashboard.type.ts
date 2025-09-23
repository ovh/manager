export type DashboardTabType = {
  name: string;
  title: string;
  to: string;
  trackingActions?: string[];
  pathMatchers?: RegExp[];
};
