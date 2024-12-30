import React from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

import { BaseLayout } from '@ovh-ux/manager-react-components';

import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  to: string;
};

export type DashboardLayoutProps = {
  tabs: DashboardTabItemProps[];
};

export default function PreinstallationPage() {
  const { t } = useTranslation('installation');

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb />}
      header={{ title: t('title') }}
      backLinkLabel={t('backlink_label')}
      onClickReturn={() => {}}
      description={t('description')}
    >
      <Outlet />
    </BaseLayout>
  );
}
