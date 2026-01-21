import { SecretConfig } from '@secret-manager/types/secret.type';
import { UseQueryResult } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { Skeleton, Text } from '@ovhcloud/ods-react';

import { Tile } from '@ovh-ux/muk';

import { ErrorResponse } from '@/common/types/api.type';

import { SECRET_CONFIG_TILE_TEST_IDS } from '../SecretConfigTile.constants';

export type MaxVersionTileItemProps = UseQueryResult<SecretConfig, ErrorResponse>;

export const MaxVersionTileItem = ({ data, isPending, isError }: MaxVersionTileItemProps) => {
  const { t } = useTranslation('secret-manager');

  if (isError) {
    return null;
  }

  return (
    <Tile.Item.Root>
      <Tile.Item.Term label={t('maximum_number_of_versions')} />
      <Tile.Item.Description>
        {isPending ? (
          <Skeleton
            data-testid={SECRET_CONFIG_TILE_TEST_IDS.skeleton}
            className="block h-5 content-center"
          />
        ) : (
          <Text preset="span">{data.maxVersions}</Text>
        )}
      </Tile.Item.Description>
    </Tile.Item.Root>
  );
};
