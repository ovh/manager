import { useSecretSmartConfig } from '@secret-manager/hooks/useSecretSmartConfig';
import { Secret } from '@secret-manager/types/secret.type';
import {
  NOT_SET_VALUE_DEACTIVATE_VERSION_AFTER,
  SecretSmartConfigOrigin,
} from '@secret-manager/utils/secretSmartConfig';
import { useTranslation } from 'react-i18next';

import { Skeleton, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Tile } from '@ovh-ux/muk';

import { useRequiredParams } from '@/common/hooks/useRequiredParams';

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
  const { okmsId } = useRequiredParams('okmsId');

  const { secretConfig, isPending, isError } = useSecretSmartConfig({ secret, okmsId });

  const labels: Record<SecretSmartConfigOrigin, string | null> = {
    SECRET: null,
    DOMAIN: `(${t('setting_domain')})`,
    DEFAULT: `(${t('setting_default')})`,
  };

  if (isError) {
    return null;
  }

  return (
    <Tile.Root title={t('settings')}>
      <Tile.Item.Root>
        <Tile.Item.Term label={t('maximum_number_of_versions')} />
        <Tile.Item.Description>
          {isPending ? (
            <Skeleton data-testid="skeleton" />
          ) : (
            <Text preset="span" data-testid={SETTINGS_TILE_TEST_IDS.MAX_VERSIONS}>
              {secretConfig.maxVersions.value} {labels[secretConfig.maxVersions.origin]}
            </Text>
          )}
        </Tile.Item.Description>
      </Tile.Item.Root>
      <Tile.Item.Root>
        <Tile.Item.Term label={t('deactivate_version_after')} />
        <Tile.Item.Description>
          {isPending ? (
            <Skeleton data-testid="skeleton" />
          ) : (
            <Text preset="span" data-testid={SETTINGS_TILE_TEST_IDS.DEACTIVATE_VERSION_AFTER}>
              {secretConfig.deactivateVersionAfter.value === NOT_SET_VALUE_DEACTIVATE_VERSION_AFTER
                ? t('never_expire')
                : secretConfig.deactivateVersionAfter.value}{' '}
              {labels[secretConfig.deactivateVersionAfter.origin]}
            </Text>
          )}
        </Tile.Item.Description>
      </Tile.Item.Root>
      <Tile.Item.Root>
        <Tile.Item.Term
          label={t('cas_with_description')}
          tooltip={t('cas_with_description_tooltip')}
        />
        <Tile.Item.Description>
          {isPending ? (
            <Skeleton data-testid="skeleton" />
          ) : (
            <Text preset="span" data-testid={SETTINGS_TILE_TEST_IDS.CAS_REQUIRED}>
              {secretConfig.casRequired.value
                ? t('activated')
                : t('disabled', { ns: NAMESPACES.STATUS })}{' '}
              {labels[secretConfig.casRequired.origin]}
            </Text>
          )}
        </Tile.Item.Description>
      </Tile.Item.Root>
      <Tile.Item.Root>
        <Tile.Item.Description divider={false}>
          <EditMetadataLink secret={secret} />
        </Tile.Item.Description>
      </Tile.Item.Root>
    </Tile.Root>
  );
};
