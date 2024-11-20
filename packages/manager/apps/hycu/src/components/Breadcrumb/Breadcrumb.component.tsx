import React from 'react';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';
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
  return <OsdsBreadcrumb items={breadcrumbItems} />;
}

export default Breadcrumb;
