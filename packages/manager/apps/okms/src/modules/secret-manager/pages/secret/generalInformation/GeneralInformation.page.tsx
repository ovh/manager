import React, { Suspense } from 'react';
import { SecretPageOutletContext } from '@secret-manager/pages/secret/Secret.type';
import { DashboardGridLayout } from '@ovh-ux/manager-react-components';
import { Outlet, useOutletContext } from 'react-router-dom';
import { InformationsTile } from '@secret-manager/pages/secret/generalInformation/InformationsTile.component';
import { SettingsTile } from '@secret-manager/pages/secret/generalInformation/SettingsTile.component';
import { ActionsTile } from '@secret-manager/pages/secret/generalInformation/ActionsTile.component';

const SecretGeneralInformationPage = () => {
  const { secret } = useOutletContext<SecretPageOutletContext>();

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
