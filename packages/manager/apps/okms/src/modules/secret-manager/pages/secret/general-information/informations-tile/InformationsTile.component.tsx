import { Secret } from '@secret-manager/types/secret.type';
import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Clipboard, Tile } from '@ovh-ux/muk';

import { useFormatDate } from '@/common/hooks/useFormatDate';
import { PATH_LABEL, URN_LABEL } from '@/constants';

export const INFORMATIONS_TILE_TEST_IDS = {
  PATH: 'secret-path',
  URN: 'secret-urn',
  CREATED_AT: 'secret-created-at',
  UPDATED_AT: 'secret-updated-at',
};

type InformationTileProps = {
  secret: Secret;
};

export const InformationsTile = ({ secret }: InformationTileProps) => {
  const { t } = useTranslation(['secret-manager', NAMESPACES.DASHBOARD]);
  const { formatDate } = useFormatDate();

  return (
    <Tile.Root title={t('general_information', { ns: NAMESPACES.DASHBOARD })}>
      <Tile.Item.Root>
        <Tile.Item.Term label={PATH_LABEL} />
        <Tile.Item.Description>
          <Text
            preset="span"
            data-testid={INFORMATIONS_TILE_TEST_IDS.PATH}
            // Temporary fix: wrap text without whitespace
            style={{ overflowWrap: 'anywhere' }}
          >
            {secret.path}
          </Text>
        </Tile.Item.Description>
      </Tile.Item.Root>

      <Tile.Item.Root>
        <Tile.Item.Term label={URN_LABEL} />
        <Tile.Item.Description>
          <Clipboard
            className="w-full"
            value={secret.iam.urn}
            data-testid={INFORMATIONS_TILE_TEST_IDS.URN}
          />
        </Tile.Item.Description>
      </Tile.Item.Root>

      <Tile.Item.Root>
        <Tile.Item.Term label={t('creation_date', { ns: NAMESPACES.DASHBOARD })} />
        <Tile.Item.Description>
          <Text preset="span" data-testid={INFORMATIONS_TILE_TEST_IDS.CREATED_AT}>
            {formatDate(secret.metadata.createdAt)}
          </Text>
        </Tile.Item.Description>
      </Tile.Item.Root>

      <Tile.Item.Root>
        <Tile.Item.Term label={t('last_update')} />
        <Tile.Item.Description>
          <Text preset="span" data-testid={INFORMATIONS_TILE_TEST_IDS.UPDATED_AT}>
            {formatDate(secret?.metadata?.updatedAt ?? '')}
          </Text>
        </Tile.Item.Description>
      </Tile.Item.Root>

      <Tile.Item.Root>
        <Tile.Item.Term label={t('current_version')} />
        <Tile.Item.Description divider={false}>
          <Text preset="span">{secret.metadata.currentVersion ?? t('no_version')}</Text>
        </Tile.Item.Description>
      </Tile.Item.Root>
    </Tile.Root>
  );
};
