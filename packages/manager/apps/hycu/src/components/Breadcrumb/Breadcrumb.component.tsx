import React from 'react';
import {
  Breadcrumb as OdsBreadcrumb,
  BreadcrumbItem as OdsBreadcrumbItem,
  BreadcrumbLink,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import {
  useBreadcrumb,
  BreadcrumbItem,
} from '@/hooks/breadcrumb/useBreadcrumb';

export interface BreadcrumbProps {
  customRootLabel?: string;
  appName?: string;
  items?: BreadcrumbItem[];
}

function Breadcrumb({ items }: BreadcrumbProps): JSX.Element {
  const { t } = useTranslation('hycu');

  const breadcrumbItems = useBreadcrumb({
    rootLabel: t('hycu_crumb'),
    items,
  });

  return (
    <OdsBreadcrumb>
      {breadcrumbItems.map((breadcrumbItem) => (
        <OdsBreadcrumbItem key={breadcrumbItem.id}>
          <BreadcrumbLink
            aria-label={breadcrumbItem.label}
            onClick={() => breadcrumbItem.onClick?.()}
          >
            {breadcrumbItem.label}
          </BreadcrumbLink>
        </OdsBreadcrumbItem>
      ))}
    </OdsBreadcrumb>
  );
}

export default Breadcrumb;
