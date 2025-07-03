import React from 'react';
import { SecretDashboardPageOutletContext } from '@secret-manager/pages/dashboard/dashboard.type';
import { DashboardGridLayout } from '@ovh-ux/manager-react-components';
import { useOutletContext } from 'react-router-dom';
import { InformationsTile } from '@secret-manager/pages/dashboard/generalInformation/InformationsTile.component';
import { SettingsTile } from '@secret-manager/pages/dashboard/generalInformation/SettingsTile.component';

const SecretGeneralInformationPage = () => {
  const { secret } = useOutletContext<SecretDashboardPageOutletContext>();

  return (
    <DashboardGridLayout>
      <InformationsTile secret={secret} />
      <SettingsTile secret={secret} />
    </DashboardGridLayout>
  );
};

export default SecretGeneralInformationPage;
