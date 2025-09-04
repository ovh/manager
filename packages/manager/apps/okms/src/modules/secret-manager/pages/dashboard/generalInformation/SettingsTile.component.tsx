import React from 'react';
import { ManagerTile } from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { Secret } from '@secret-manager/types/secret.type';

type SettingsTileProps = {
  secret: Secret;
};

export const SettingsTile = ({ secret }: SettingsTileProps) => {
  const { t } = useTranslation('secret-manager');

  return (
    <ManagerTile>
      <ManagerTile.Title>{t('settings')}</ManagerTile.Title>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label
          tooltip={t('maximum_number_of_versions_tooltip')}
        >
          {t('maximum_number_of_versions')}
        </ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          <OdsText preset="span">
            {secret.metadata.maxVersions || t('not_provided')}
          </OdsText>
        </ManagerTile.Item.Description>
      </ManagerTile.Item>

      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>
          {t('deactivate_version_after')}
        </ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          <OdsText preset="span">
            {secret.metadata.deactivateVersionAfter || t('not_provided')}
          </OdsText>
        </ManagerTile.Item.Description>
      </ManagerTile.Item>

      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label tooltip={t('cas_with_description_tooltip')}>
          {t('cas_with_description')}
        </ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          <OdsText preset="span">
            {secret.metadata.casRequired ? t('activated') : t('deactivated')}
          </OdsText>
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
    </ManagerTile>
  );
};
