export type DashboardHeaderProps = {
  serviceName: string;
  customName?: string;
  onEditName: () => void;
  guides?: Array<{
    id: string;
    link: string;
    title: string;
    description: string;
  }>;
  isEolService?: boolean;
};
