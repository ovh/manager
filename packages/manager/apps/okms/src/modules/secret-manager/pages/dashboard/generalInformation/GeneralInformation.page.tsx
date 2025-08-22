import React, { Suspense } from 'react';
import { SecretDashboardPageOutletContext } from '@secret-manager/pages/dashboard/dashboard.type';
import { DashboardGridLayout } from '@ovh-ux/manager-react-components';
import { Outlet, useOutletContext } from 'react-router-dom';
import { InformationsTile } from '@secret-manager/pages/dashboard/generalInformation/InformationsTile.component';
import { SettingsTile } from '@secret-manager/pages/dashboard/generalInformation/SettingsTile.component';
import { ActionsTile } from './ActionsTile.component';

const SecretGeneralInformationPage = () => {
  const { secret } = useOutletContext<SecretDashboardPageOutletContext>();

  return (
    <DashboardGridLayout>
      <InformationsTile secret={secret} />
      <SettingsTile secret={secret} />
      <ActionsTile secret={secret} />
      <Suspense>
        <Outlet />
      </Suspense>
    </DashboardGridLayout>
  );
};

export default SecretGeneralInformationPage;
