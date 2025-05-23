import { useTranslation } from 'react-i18next';

import {
  OdsFormField,
  OdsInput,
  OdsText,
} from '@ovhcloud/ods-components/react';

import clsx from 'clsx';

type TReplicationRulePrefix = {
  replicationRulePrefix: string;
  setReplicationRulePrefix: (value: string) => void;
  setIsReplicationRulePrefixTouched: (value: boolean) => void;
  prefixError: string | undefined;
};

export function ReplicationRulePrefix({
  replicationRulePrefix,
  setReplicationRulePrefix,
  setIsReplicationRulePrefixTouched,
  prefixError,
}: Readonly<TReplicationRulePrefix>) {
  const { t } = useTranslation([
    'containers/add',
    'containers/replication/add',
  ]);

  return (
    <OdsFormField error={prefixError} className="mt-8 max-w-[800px] block">
      <label slot="label" className="block">
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
