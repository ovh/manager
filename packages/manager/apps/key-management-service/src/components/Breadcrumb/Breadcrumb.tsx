import React from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';
import {
  BreadcrumbItem,
  useBreadcrumb,
} from '@/hooks/breadcrumb/useBreadcrumb';

export interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

function Breadcrumb({ items }: Readonly<BreadcrumbProps>): JSX.Element {
  const { t } = useTranslation('key-management-service/listing');

  const breadcrumbItems = useBreadcrumb({
    rootLabel: t('key_management_service_listing_title'),
    items,
  });

  return <OsdsBreadcrumb items={breadcrumbItems} />;
}

export default Breadcrumb;
