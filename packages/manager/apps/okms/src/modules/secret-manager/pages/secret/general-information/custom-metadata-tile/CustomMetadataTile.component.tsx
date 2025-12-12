import { Secret } from '@secret-manager/types/secret.type';
import { useTranslation } from 'react-i18next';

import { Tile } from '@ovh-ux/muk';

import { KeyValueTagsList } from '@/common/components/key-value-tags-list/KeyValueTagsList.component';

import { EditCustomMetadataLink } from './link/EditCustomMetadataLink.component';

type CustomMetadataTileProps = {
  secret: Secret;
};

export const CustomMetadataTile = ({ secret }: CustomMetadataTileProps) => {
  const { t } = useTranslation('secret-manager');

  const customMetadata = secret.metadata.customMetadata;

  return (
    <Tile.Root title={t('metadata')}>
      {customMetadata && (
        <Tile.Item.Root>
          <Tile.Item.Description>
            <KeyValueTagsList tags={customMetadata} />
          </Tile.Item.Description>
        </Tile.Item.Root>
      )}
      <Tile.Item.Root>
        <Tile.Item.Description divider={false}>
          <EditCustomMetadataLink secret={secret} />
        </Tile.Item.Description>
      </Tile.Item.Root>
    </Tile.Root>
  );
};
