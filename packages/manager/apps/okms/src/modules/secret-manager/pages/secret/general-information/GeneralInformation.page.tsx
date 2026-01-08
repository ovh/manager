import { Suspense } from 'react';

import { Outlet, useOutletContext } from 'react-router-dom';

import { SecretPageOutletContext } from '@secret-manager/pages/secret/Secret.type';

import { GridLayout } from '@ovh-ux/muk';

import { ActionsTile } from './actions-tile/ActionsTile.component';
import { InformationsTile } from './informations-tile/InformationsTile.component';
import { SettingsTile } from './settings-tile/SettingsTile.component';

const SecretGeneralInformationPage = () => {
  const { secret } = useOutletContext<SecretPageOutletContext>();

  return (
    <GridLayout>
      <InformationsTile secret={secret} />
      <SettingsTile secret={secret} />
      <ActionsTile secret={secret} />
      <Suspense>
        <Outlet />
      </Suspense>
    </GridLayout>
  );
};

export default SecretGeneralInformationPage;
