import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import { BaseLayout } from '@ovh-ux/manager-react-components';

import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  to: string;
};

export type DashboardLayoutProps = {
  tabs: DashboardTabItemProps[];
};

export default function DashboardPage() {
  const [panel, setActivePanel] = useState('');
  const { serviceName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation('dashboard');

  const header = {
    title: serviceName,
  };

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb />}
      header={header}
      description="Description du web-office"
    >
      <Outlet />
    </BaseLayout>
  );
}
