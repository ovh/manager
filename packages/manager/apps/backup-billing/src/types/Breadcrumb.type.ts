export type BreadcrumbItem = {
  id: string;
  label: string | undefined;
  href: string;
};

export type BreadcrumbProps = {
  items?: BreadcrumbItem[];
};
