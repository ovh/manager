export type BreadcrumbItem = {
  label: string;
  href: string;
};

export type BreadcrumbProps = {
  customRootLabel?: string;
  items?: BreadcrumbItem[];
};
