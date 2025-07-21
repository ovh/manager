import React from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

import {
  BaseLayout,
  IconLinkAlignmentType,
  Notifications,
} from '@ovh-ux/manager-react-components';

import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { useFormSteps } from '@/hooks/formStep/useFormSteps';
import { InstallationFormContextProvider } from '@/context/InstallationForm.context';
import { INSTALLATION_STEPS } from './installation.constants';

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

  return (
    <InstallationFormContextProvider>
      <BaseLayout
        breadcrumb={<Breadcrumb />}
        header={{
          title: t('title', {
            step: currentStep,
            total: Object.keys(INSTALLATION_STEPS).length,
          }),
        }}
        backLinkLabel={t('backlink_label')}
        onClickReturn={() => {}}
        description={t('description')}
        backLinkIconAlignment={IconLinkAlignmentType.left}
        message={<Notifications />}
      >
        <Outlet />
      </BaseLayout>
    </InstallationFormContextProvider>
  );
}
