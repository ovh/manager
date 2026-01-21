import { Secret } from '@secret-manager/types/secret.type';
import { useTranslation } from 'react-i18next';

import { Tile } from '@ovh-ux/muk';

import { CreateVersionLink } from './items/CreateVersionLink.component';
import { DeleteSecretLink } from './items/DeleteSecretLink.component';
import { ShowValueLink } from './items/ShowValueLink.component';

type ActionsTileParams = {
  secret: Secret;
};

export const ActionsTile = ({ secret }: ActionsTileParams) => {
  const { t } = useTranslation('secret-manager');

  return (
    <Tile.Root title={t('actions')}>
      <Tile.Item.Root>
        <Tile.Item.Description divider={false}>
          <div className="flex flex-col gap-2">
            <ShowValueLink secret={secret} />
            <CreateVersionLink secret={secret} />
            <DeleteSecretLink secret={secret} />
          </div>
        </Tile.Item.Description>
      </Tile.Item.Root>
    </Tile.Root>
  );
};
