import { SecretConfig } from '@secret-manager/types/secret.type';
import { UseQueryResult } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { Skeleton, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Tile } from '@ovh-ux/muk';

import { ErrorResponse } from '@/common/types/api.type';

import { SECRET_CONFIG_TILE_TEST_IDS } from '../SecretConfigTile.constants';

export type CasTileItemProps = UseQueryResult<SecretConfig, ErrorResponse> & {
  divider?: boolean;
};

export const CasTileItem = ({ data, isPending, isError, divider = true }: CasTileItemProps) => {
  const { t } = useTranslation(['secret-manager', NAMESPACES.STATUS]);

  if (isError) {
    return null;
  }

  return (
    <Tile.Item.Root>
      <Tile.Item.Term
        label={t('cas_with_description')}
        tooltip={t('cas_with_description_tooltip')}
      />
      <Tile.Item.Description divider={divider}>
        {isPending ? (
          <Skeleton
            data-testid={SECRET_CONFIG_TILE_TEST_IDS.skeleton}
            className="block h-5 content-center"
          />
        ) : (
          <Text preset="span">
            {data.casRequired ? t('activated') : t('disabled', { ns: NAMESPACES.STATUS })}
          </Text>
        )}
      </Tile.Item.Description>
    </Tile.Item.Root>
  );
};
