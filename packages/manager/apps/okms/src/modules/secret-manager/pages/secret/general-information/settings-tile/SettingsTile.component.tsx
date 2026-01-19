import { useSecretSmartConfig } from '@secret-manager/hooks/useSecretSmartConfig';
import { Secret } from '@secret-manager/types/secret.type';
import {
  NOT_SET_VALUE_DEACTIVATE_VERSION_AFTER,
  SecretSmartConfigOrigin,
} from '@secret-manager/utils/secretSmartConfig';
import { useTranslation } from 'react-i18next';

import { OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ManagerTile } from '@ovh-ux/manager-react-components';

import { EditMetadataLink } from './EditMetadataLink.component';

export const SETTINGS_TILE_TEST_IDS = {
  CAS_REQUIRED: 'secret-cas-required',
  DEACTIVATE_VERSION_AFTER: 'secret-deactivate-version-after',
  MAX_VERSIONS: 'secret-max-versions',
};

type SettingsTileProps = {
  secret: Secret;
};

export const SettingsTile = ({ secret }: SettingsTileProps) => {
  const { t } = useTranslation(['secret-manager', NAMESPACES.STATUS]);
  const { secretConfig, isPending, isError } = useSecretSmartConfig(secret);

  const labels: Record<SecretSmartConfigOrigin, string | null> = {
    SECRET: null,
    DOMAIN: `(${t('setting_domain')})`,
    DEFAULT: `(${t('setting_default')})`,
  };

  if (isError) {
    return null;
  }

  return (
    <ManagerTile>
      <ManagerTile.Title>{t('settings')}</ManagerTile.Title>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{t('maximum_number_of_versions')}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isPending ? (
            <OdsSkeleton />
          ) : (
            <OdsText preset="span" data-testid={SETTINGS_TILE_TEST_IDS.MAX_VERSIONS}>
              {secretConfig.maxVersions.value} {labels[secretConfig.maxVersions.origin]}
            </OdsText>
          )}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{t('deactivate_version_after')}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isPending ? (
            <OdsSkeleton />
          ) : (
            <OdsText preset="span" data-testid={SETTINGS_TILE_TEST_IDS.DEACTIVATE_VERSION_AFTER}>
              {secretConfig.deactivateVersionAfter.value === NOT_SET_VALUE_DEACTIVATE_VERSION_AFTER
                ? t('never_expire')
                : secretConfig.deactivateVersionAfter.value}{' '}
              {labels[secretConfig.deactivateVersionAfter.origin]}
            </OdsText>
          )}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label tooltip={t('cas_with_description_tooltip')}>
          {t('cas_with_description')}
        </ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isPending ? (
            <OdsSkeleton />
          ) : (
            <OdsText preset="span" data-testid={SETTINGS_TILE_TEST_IDS.CAS_REQUIRED}>
              {secretConfig.casRequired.value
                ? t('activated')
                : t('disabled', { ns: NAMESPACES.STATUS })}{' '}
              {labels[secretConfig.casRequired.origin]}
            </OdsText>
          )}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <EditMetadataLink secret={secret} />
    </ManagerTile>
  );
};
