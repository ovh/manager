import { useTranslation } from 'react-i18next';

import { useMemo } from 'react';
import {
  OdsFormField,
  OdsInput,
  OdsText,
} from '@ovhcloud/ods-components/react';

import clsx from 'clsx';

export function ReplicationRulePrefix({
  replicationRulePrefix,
  setReplicationRulePrefix,
  isReplicationRulePrefixTouched,
  setIsReplicationRulePrefixTouched,
  isValidReplicationRulePrefix,
  prefixError,
  setPrefixError,
}) {
  const { t } = useTranslation([
    'containers/add',
    'containers/replication/add',
  ]);

  useMemo(() => {
    if (
      isReplicationRulePrefixTouched &&
      !isValidReplicationRulePrefix &&
      replicationRulePrefix !== ''
    ) {
      setPrefixError(t('pci-common:common_field_error_pattern'));
    } else {
      setPrefixError(undefined);
    }
  }, [
    isReplicationRulePrefixTouched,
    replicationRulePrefix,
    isValidReplicationRulePrefix,
  ]);

  return (
    <OdsFormField error={prefixError} className="mt-8 w-[676px] block">
      <label slot="label">
        {t(
          'containers/replication/add:pci_projects_project_storages_containers_replication_add_prefix',
        )}
      </label>
      <OdsInput
        className="w-full"
        placeholder={t(
          'containers/replication/add:pci_projects_project_storages_containers_replication_add_prefix_placeholder',
        )}
        value={replicationRulePrefix}
        name="containerPrefix"
        color="primary"
        onOdsChange={(event) => {
          setReplicationRulePrefix(`${event.detail.value || ''}`);
        }}
        onOdsBlur={() => {
          setIsReplicationRulePrefixTouched(true);
        }}
      />

      <OdsText
        slot="helper"
        preset="caption"
        className={clsx('max-w-2xl', prefixError && 'text-critical')}
      >
        {t(
          'containers/replication/add:pci_projects_project_storages_containers_replication_add_prefix_helper_text',
        )}
      </OdsText>
    </OdsFormField>
  );
}
