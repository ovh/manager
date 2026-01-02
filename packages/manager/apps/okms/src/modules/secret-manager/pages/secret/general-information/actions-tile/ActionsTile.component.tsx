import { Secret } from '@secret-manager/types/secret.type';
import { useTranslation } from 'react-i18next';

import { ManagerTile } from '@ovh-ux/manager-react-components';

import { CreateVersionLink } from './items/CreateVersionLink.component';
import { DeleteSecretLink } from './items/DeleteSecretLink.component';
import { ShowValueLink } from './items/ShowValueLink.component';

type ActionsTileParams = {
  secret: Secret;
};

export const ActionsTile = ({ secret }: ActionsTileParams) => {
  const { t } = useTranslation('secret-manager');

  return (
    <ManagerTile>
      <ManagerTile.Title>{t('actions')}</ManagerTile.Title>
      <ManagerTile.Divider />
      <div className="flex flex-col gap-2">
        <ShowValueLink secret={secret} />
        <CreateVersionLink secret={secret} />
        <DeleteSecretLink secret={secret} />
      </div>
    </ManagerTile>
  );
};
