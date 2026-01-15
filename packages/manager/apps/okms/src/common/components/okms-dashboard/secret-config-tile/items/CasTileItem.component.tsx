import { SecretConfig } from '@secret-manager/types/secret.type';
import { UseQueryResult } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { Skeleton, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ManagerTile } from '@ovh-ux/manager-react-components';

import { ErrorResponse } from '@/common/types/api.type';

import { SECRET_CONFIG_TILE_TEST_IDS } from '../SecretConfigTile.constants';

export type CasTileItemProps = UseQueryResult<SecretConfig, ErrorResponse>;

export const CasTileItem = ({ data, isPending, isError }: CasTileItemProps) => {
  const { t } = useTranslation(['secret-manager', NAMESPACES.STATUS]);

  if (isError) {
    return null;
  }

  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label tooltip={t('cas_with_description_tooltip')}>
        {t('cas_with_description')}
      </ManagerTile.Item.Label>
      <ManagerTile.Item.Description>
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
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  );
};
