export type DashboardTabItemProps = {
  name: string;
  title: string;
  to: string;
  pathMatchers?: RegExp[];
  onClick?: () => void;
};
