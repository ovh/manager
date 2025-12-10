import { useHref } from 'react-router-dom';

import {
  BreadcrumbItem,
  useBreadcrumb,
} from '@key-management-service/hooks/breadcrumb/useBreadcrumb';

import { OdsBreadcrumb, OdsBreadcrumbItem } from '@ovhcloud/ods-components/react';

export type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

function Breadcrumb({ items }: BreadcrumbProps) {
  const breadcrumbItems = useBreadcrumb({ items });

  return (
    <OdsBreadcrumb>
      {breadcrumbItems.map(({ id, label, navigateTo }) => (
        <Item key={id} id={id} label={label} navigateTo={navigateTo} />
      ))}
    </OdsBreadcrumb>
  );
}

const Item = ({ id, label, navigateTo }: BreadcrumbItem) => {
  const href = useHref(navigateTo ?? '');
  return <OdsBreadcrumbItem key={id} label={label} href={href} />;
};

export default Breadcrumb;
