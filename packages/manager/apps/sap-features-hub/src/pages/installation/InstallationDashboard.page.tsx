import React from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import {
  BaseLayout,
  IconLinkAlignmentType,
  Notifications,
} from '@ovh-ux/manager-react-components';

import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { useFormSteps } from '@/hooks/formStep/useFormSteps';
import { InstallationFormContextProvider } from '@/context/InstallationForm.context';
import { INSTALLATION_STEPS } from './installation.constants';
import { subRoutes, urls } from '@/routes/routes.constant';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  to: string;
};

export type DashboardLayoutProps = {
  tabs: DashboardTabItemProps[];
};

export default function InstallationDashboard() {
  const { t } = useTranslation('installation');
  const { currentStep } = useFormSteps();
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitle = location.pathname.includes(subRoutes.wizard)
    ? t('title_without_step')
    : t('title', {
        step: currentStep,
        total: Object.keys(INSTALLATION_STEPS).length,
      });

  return (
    <InstallationFormContextProvider>
      <BaseLayout
        breadcrumb={<Breadcrumb />}
        header={{ title: pageTitle }}
        backLinkLabel={t('backlink_label')}
        onClickReturn={() => navigate(urls.dashboard)}
        description={t('description')}
        iconAlignment={IconLinkAlignmentType.left}
        message={<Notifications />}
      >
        <Outlet />
      </BaseLayout>
    </InstallationFormContextProvider>
  );
}
