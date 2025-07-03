import React from 'react';
import {
  DashboardTile,
  DashboardTileBlockItem,
} from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { Secret } from '@secret-manager/types/secret.type';

type SettingsTileProps = {
  secret: Secret;
};

export const SettingsTile = ({ secret }: SettingsTileProps) => {
  const { t } = useTranslation('secret-manager/dashboard');

  const items: DashboardTileBlockItem[] = [
    {
      id: 'max_versions',
      label: t('maximum_number_of_versions'),
      value: (
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {secret.metadata.maxVersions || t('not_provided')}
        </OdsText>
      ),
    },
    {
      id: 'deactivate_version_after',
      label: t('deactivate_version_after'),
      value: (
        <OdsText preset={ODS_TEXT_PRESET.span}>
          {secret.metadata.deactivateVersionAfter || t('not_provided')}
        </OdsText>
      ),
    },
    {
      id: 'cas',
      label: t('cas_with_description'),
      value: (
        <OdsText preset={ODS_TEXT_PRESET.span}>
          {secret.metadata.casRequired ? t('activated') : t('deactivated')}
        </OdsText>
      ),
    },
  ];

  return <DashboardTile title={t('settings')} items={items} />;
};
