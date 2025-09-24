import React from 'react';
import { ManagerTile } from '@ovh-ux/manager-react-components';
import { OdsText, OdsSkeleton } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { Secret } from '@secret-manager/types/secret.type';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useSecretSmartConfig } from '@secret-manager/hooks/useSecretSmartConfig';
import {
  SecretSmartConfigOrigin,
  NOT_SET_VALUE_DEACTIVATE_VERSION_AFTER,
} from '@secret-manager/utils/secretSmartConfig';
import { SECRET_TEST_IDS } from '@secret-manager/pages/secret/generalInformation/GeneralInformation.constants';

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
        <ManagerTile.Item.Label>
          {t('maximum_number_of_versions')}
        </ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isPending ? (
            <OdsSkeleton />
          ) : (
            <OdsText preset="span" data-testid={SECRET_TEST_IDS.MAX_VERSIONS}>
              {secretConfig.maxVersions.value}{' '}
              {labels[secretConfig.maxVersions.origin]}
            </OdsText>
          )}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>
          {t('deactivate_version_after')}
        </ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isPending ? (
            <OdsSkeleton />
          ) : (
            <OdsText
              preset="span"
              data-testid={SECRET_TEST_IDS.DEACTIVATE_VERSION_AFTER}
            >
              {secretConfig.deactivateVersionAfter.value ===
              NOT_SET_VALUE_DEACTIVATE_VERSION_AFTER
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
            <OdsText preset="span" data-testid={SECRET_TEST_IDS.CAS_REQUIRED}>
              {secretConfig.casRequired.value
                ? t('activated')
                : t('disabled', { ns: NAMESPACES.STATUS })}{' '}
              {labels[secretConfig.casRequired.origin]}
            </OdsText>
          )}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
    </ManagerTile>
  );
};
