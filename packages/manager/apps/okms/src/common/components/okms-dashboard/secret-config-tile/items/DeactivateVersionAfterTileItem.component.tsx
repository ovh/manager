import { SecretConfig } from '@secret-manager/types/secret.type';
import { UseQueryResult } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';

import { ManagerTile } from '@ovh-ux/manager-react-components';

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
    <ManagerTile.Item>
      <ManagerTile.Item.Label>{t('deactivate_version_after')}</ManagerTile.Item.Label>
      <ManagerTile.Item.Description>
        {isPending ? (
          <OdsSkeleton
            data-testid={SECRET_CONFIG_TILE_TEST_IDS.skeleton}
            className="block h-5 content-center"
          />
        ) : (
          <OdsText preset="span">{data.deactivateVersionAfter}</OdsText>
        )}
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  );
};
