import React from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

import { BaseLayout } from '@ovh-ux/manager-react-components';

import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { productName } from '@/sap-features-hub.config';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  to: string;
};

export type DashboardLayoutProps = {
  tabs: DashboardTabItemProps[];
};

export default function DashboardPage() {
  const { t } = useTranslation('dashboard');

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb />}
      header={{
        title: productName,
        description: t('description'),
      }}
    >
      <Outlet />
    </BaseLayout>
  );
}
