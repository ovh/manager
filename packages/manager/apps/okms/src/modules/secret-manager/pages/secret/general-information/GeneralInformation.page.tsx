import { Suspense } from 'react';

import { Outlet, useOutletContext } from 'react-router-dom';

import { SecretPageOutletContext } from '@secret-manager/pages/secret/Secret.type';
import { ActionsTile } from '@secret-manager/pages/secret/general-information/ActionsTile.component';
import { InformationsTile } from '@secret-manager/pages/secret/general-information/InformationsTile.component';
import { SettingsTile } from '@secret-manager/pages/secret/general-information/SettingsTile.component';

import { DashboardGridLayout } from '@ovh-ux/manager-react-components';

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
