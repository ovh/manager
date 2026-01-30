import { Suspense } from 'react';

import { Outlet, useOutletContext } from 'react-router-dom';

import { SecretPageOutletContext } from '@secret-manager/pages/secret/Secret.type';
import { ActionsTile } from '@secret-manager/pages/secret/general-information/actions-tile/ActionsTile.component';
import { CustomMetadataTile } from '@secret-manager/pages/secret/general-information/custom-metadata-tile/CustomMetadataTile.component';
import { InformationsTile } from '@secret-manager/pages/secret/general-information/informations-tile/InformationsTile.component';
import { SettingsTile } from '@secret-manager/pages/secret/general-information/settings-tile/SettingsTile.component';

import { GridLayout } from '@ovh-ux/muk';

const SecretGeneralInformationPage = () => {
  const { secret } = useOutletContext<SecretPageOutletContext>();

  return (
    <GridLayout>
      <InformationsTile secret={secret} />
      <div className="flex flex-col gap-6">
        <SettingsTile secret={secret} />
        <CustomMetadataTile secret={secret} />
      </div>
      <ActionsTile secret={secret} />
      <Suspense>
        <Outlet />
      </Suspense>
    </GridLayout>
  );
};

export default SecretGeneralInformationPage;
