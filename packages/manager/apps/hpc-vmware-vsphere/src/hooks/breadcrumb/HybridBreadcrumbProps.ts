import { DashboardTabItem } from '@/types/DashboardTabItem';

export interface HybridBreadcrumbProps {
  appName: string;
  service: { name: string; description: string };
  legacyAppBaseUrl: string;
  activePanel: DashboardTabItem | undefined;
}
