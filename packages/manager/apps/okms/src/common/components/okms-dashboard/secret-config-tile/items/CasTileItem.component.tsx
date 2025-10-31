import React from 'react';
import { ManagerTile } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';
import { SecretConfig } from '@secret-manager/types/secret.type';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { SECRET_CONFIG_TILE_TEST_IDS } from '../SecretConfigTile.constants';

type CasTileItemProps = {
  secretConfig: SecretConfig;
  isPending: boolean;
};

export const CasTileItem = ({ secretConfig, isPending }: CasTileItemProps) => {
  const { t } = useTranslation(['secret-manager', NAMESPACES.STATUS]);

  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label tooltip={t('cas_with_description_tooltip')}>
        {t('cas_with_description')}
      </ManagerTile.Item.Label>
      <ManagerTile.Item.Description>
        {isPending ? (
          <OdsSkeleton
            data-testid={SECRET_CONFIG_TILE_TEST_IDS.skeleton}
            className="block content-center h-5"
          />
        ) : (
          <OdsText preset="span">
            {secretConfig.casRequired
              ? t('activated')
              : t('disabled', { ns: NAMESPACES.STATUS })}
          </OdsText>
        )}
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  );
};
