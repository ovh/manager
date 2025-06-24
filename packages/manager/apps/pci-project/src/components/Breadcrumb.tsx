import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import { JSX as OdsJSX } from '@ovhcloud/ods-components';
import { urls } from '@/routes/routes.constant';

export type BreadcrumbItem = OdsJSX.OdsBreadcrumbItem;

export type BreadcrumbProps = {
  items?: BreadcrumbItem[];
};

export function Breadcrumb({
  items = [],
}: {
  items?: BreadcrumbItem[];
}): JSX.Element {
  const rootItem: BreadcrumbItem = {
    icon: 'home',
    href: urls.root,
  };
  const allItems: BreadcrumbItem[] = [rootItem, ...items];

  return (
    <OdsBreadcrumb>
      {allItems.map((item, idx) => (
        <OdsBreadcrumbItem
          key={(item.label || item.icon) + item.href + idx}
          {...item}
        />
      ))}
    </OdsBreadcrumb>
  );
}
