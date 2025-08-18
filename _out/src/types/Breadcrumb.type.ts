type BreadcrumbEventType = Event & {
  target: { isCollapsed?: boolean; isLast?: boolean };
};

export type BreadcrumbItemType = {
  id?: string;
  label?: string;
  href?: string;
  onClick?: (event?: BreadcrumbEventType) => void;
};

export interface BreadcrumbProps {
  customRootLabel?: string;
  rootLabel?: string;
  appName?: string;
  items?: BreadcrumbItemType[];
}
