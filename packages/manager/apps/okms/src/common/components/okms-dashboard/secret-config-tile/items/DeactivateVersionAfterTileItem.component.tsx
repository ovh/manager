import { SecretConfig } from '@secret-manager/types/secret.type';
import { UseQueryResult } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { Skeleton, Text } from '@ovhcloud/ods-react';

import { Tile } from '@ovh-ux/muk';

import { ErrorResponse } from '@/common/types/api.type';

import { SECRET_CONFIG_TILE_TEST_IDS } from '../SecretConfigTile.constants';

export type DeactivateVersionAfterTileItemProps = UseQueryResult<SecretConfig, ErrorResponse>;

export const DeactivateVersionAfterTileItem = ({
  data,
  isPending,
  isError,
}: DeactivateVersionAfterTileItemProps) => {
  const { t } = useTranslation('secret-manager');

  if (isError) {
    return null;
  }

  return (
    <Tile.Item.Root>
      <Tile.Item.Term label={t('deactivate_version_after')} />
      <Tile.Item.Description>
        {isPending ? (
          <Skeleton
            data-testid={SECRET_CONFIG_TILE_TEST_IDS.skeleton}
            className="block h-5 content-center"
          />
        ) : (
          <Text preset="span">{data.deactivateVersionAfter}</Text>
        )}
      </Tile.Item.Description>
    </Tile.Item.Root>
  );
};
