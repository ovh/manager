import { useHref } from 'react-router-dom';

import {
  KmsBreadcrumbItem,
  useBreadcrumb,
} from '@key-management-service/hooks/breadcrumb/useBreadcrumb';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@ovhcloud/ods-react';

export type KmsBreadcrumbProps = {
  items: KmsBreadcrumbItem[];
};

const KmsBreadcrumb = ({ items }: KmsBreadcrumbProps) => {
  const breadcrumbItems = useBreadcrumb({ items });

  return (
    <Breadcrumb>
      {breadcrumbItems.map(({ id, label, navigateTo }) => (
        <Item key={id} id={id} label={label} navigateTo={navigateTo} />
      ))}
    </Breadcrumb>
  );
};

const Item = ({ id, label, navigateTo }: KmsBreadcrumbItem) => {
  const href = useHref(navigateTo ?? '');
  return (
    <BreadcrumbItem key={id}>
      <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
    </BreadcrumbItem>
  );
};

export default KmsBreadcrumb;
