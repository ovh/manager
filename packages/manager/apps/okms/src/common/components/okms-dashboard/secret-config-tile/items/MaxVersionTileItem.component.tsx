import React from 'react';
import { ManagerTile } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';
import { SecretConfig } from '@secret-manager/types/secret.type';
import { SECRET_CONFIG_TILE_TEST_IDS } from '../SecretConfigTile.constants';

type MaxVersionTileItemProps = {
  secretConfig: SecretConfig;
  isPending: boolean;
};

export const MaxVersionTileItem = ({
  secretConfig,
  isPending,
}: MaxVersionTileItemProps) => {
  const { t } = useTranslation('secret-manager');

  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>
        {t('maximum_number_of_versions')}
      </ManagerTile.Item.Label>
      <ManagerTile.Item.Description>
        {isPending ? (
          <OdsSkeleton
            data-testid={SECRET_CONFIG_TILE_TEST_IDS.skeleton}
            className="block content-center h-5"
          />
        ) : (
          <OdsText preset="span">{secretConfig.maxVersions}</OdsText>
        )}
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  );
};
