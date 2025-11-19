import { useNavigate } from 'react-router-dom';

import {
  BreadcrumbItem,
  useBreadcrumb,
} from '@key-management-service/hooks/breadcrumb/useBreadcrumb';

import { OdsBreadcrumb, OdsBreadcrumbItem } from '@ovhcloud/ods-components/react';

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
