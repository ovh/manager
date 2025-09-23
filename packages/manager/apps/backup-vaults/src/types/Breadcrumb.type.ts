export type BreadcrumbItem = {
  label: string | undefined;
  href: string;
};

export interface BreadcrumbProps {
  rootLabel?: string;
  customRootLabel?: string;
  appName: string;
  projectId?: string;
}
