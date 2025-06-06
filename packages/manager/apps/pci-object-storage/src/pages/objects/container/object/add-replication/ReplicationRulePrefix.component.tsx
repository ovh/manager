import { useTranslation } from 'react-i18next';

import { useEffect } from 'react';
import {
  OdsFormField,
  OdsInput,
  OdsText,
} from '@ovhcloud/ods-components/react';

import clsx from 'clsx';

type TReplicationRulePrefix = {
  replicationRulePrefix: string;
  setReplicationRulePrefix: (value: string) => void;
  isReplicationRulePrefixTouched: boolean;
  setIsReplicationRulePrefixTouched: (value: boolean) => void;
  isValidReplicationRulePrefix: boolean;
  prefixError: string | undefined;
  setPrefixError: (value: string | undefined) => void;
};
export function ReplicationRulePrefix({
  replicationRulePrefix,
  setReplicationRulePrefix,
  isReplicationRulePrefixTouched,
  setIsReplicationRulePrefixTouched,
  isValidReplicationRulePrefix,
  prefixError,
  setPrefixError,
}: TReplicationRulePrefix) {
  const { t } = useTranslation([
    'containers/add',
    'containers/replication/add',
  ]);

  useEffect(() => {
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
    t,
  ]);

  return (
    <OdsFormField error={prefixError} className="mt-8 max-w-[800px] block">
      <label slot="label" className="block">
        {t(
          'containers/replication/add:pci_projects_project_storages_containers_replication_add_tags',
        )}
        <OdsText preset="caption" className="mt-2">
          {t(
            'containers/replication/add:pci_projects_project_storages_containers_replication_add_tags_title_helper_text',
          )}
        </OdsText>
      </label>
      <label slot="label" className="block mt-8">
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
