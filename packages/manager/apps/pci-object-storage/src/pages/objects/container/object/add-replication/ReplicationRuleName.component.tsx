import { useTranslation } from 'react-i18next';

import { useMemo } from 'react';

import {
  OdsFormField,
  OdsInput,
  OdsText,
} from '@ovhcloud/ods-components/react';

import clsx from 'clsx';

export function ReplicationRuleId({
  replicationRuleId,
  setReplicationRuleId,
  isReplicationRuleIdTouched,
  setIsReplicationRuleIdTouched,
  isValidReplicationRuleId,
  idError,
  setIdError,
}) {
  const { t } = useTranslation([
    'containers/add',
    'containers/replication/add',
  ]);

  useMemo(() => {
    if (isReplicationRuleIdTouched && !replicationRuleId) {
      setIdError(t('pci-common:common_field_error_required'));
    } else if (isReplicationRuleIdTouched && !isValidReplicationRuleId) {
      setIdError(t('pci-common:common_field_error_pattern'));
    } else {
      setIdError(undefined);
    }
  }, [isReplicationRuleIdTouched, replicationRuleId, isValidReplicationRuleId]);

  return (
    <OdsFormField error={idError} className="w-[676px] block">
      <label slot="label">
        {t(
          'containers/replication/add:pci_projects_project_storages_containers_replication_add_name',
        )}
      </label>

      <OdsInput
        className="w-full"
        value={replicationRuleId}
        placeholder={t(
          'containers/replication/add:pci_projects_project_storages_containers_replication_add_name_placeholder',
        )}
        name="containerId"
        color="primary"
        isRequired
        onOdsChange={(event) => {
          setReplicationRuleId(`${event.detail.value || ''}`);
        }}
        onOdsBlur={() => {
          setIsReplicationRuleIdTouched(true);
        }}
      />

      <OdsText
        slot="helper"
        preset="caption"
        className={clsx('max-w-2xl', idError && 'text-critical')}
      >
        {t(
          'containers/replication/add:pci_projects_project_storages_containers_replication_add_name_helper_text',
        )}
      </OdsText>
    </OdsFormField>
  );
}
