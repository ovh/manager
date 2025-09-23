import React from 'react';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import { useNavigate } from 'react-router-dom';
import {
  BreadcrumbItem,
  useBreadcrumb,
} from '@/hooks/breadcrumb/useBreadcrumb';

export type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

function Breadcrumb({ items }: BreadcrumbProps) {
  const navigate = useNavigate();
  const breadcrumbItems = useBreadcrumb({ items });

  return (
    <OdsBreadcrumb>
      {breadcrumbItems.map(({ id, label, navigateTo }) => (
        <OdsBreadcrumbItem
          key={id}
          label={label}
          onOdsClick={() => {
            if (navigateTo) {
              navigate(navigateTo);
            }
          }}
          href={undefined}
        />
      ))}
    </OdsBreadcrumb>
  );
}

export default Breadcrumb;
