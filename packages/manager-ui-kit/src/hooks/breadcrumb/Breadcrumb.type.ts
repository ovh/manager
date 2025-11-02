export type BreadcrumbItem = {
  label: string | undefined;
  href?: string;
  hideLabel?: boolean;
};

export interface BreadcrumbType {
  rootLabel?: string;
  appName?: string;
  projectId?: string;
  hideRootLabel?: boolean;
}
