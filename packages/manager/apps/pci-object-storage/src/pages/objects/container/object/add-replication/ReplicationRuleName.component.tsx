import { useTranslation } from 'react-i18next';

import { useEffect } from 'react';

import {
  OdsFormField,
  OdsInput,
  OdsText,
} from '@ovhcloud/ods-components/react';

import clsx from 'clsx';

type TReplicationRuleIdProps = {
  replicationRuleId: string;
  setReplicationRuleId: (value: string) => void;
  isReplicationRuleIdTouched: boolean;
  setIsReplicationRuleIdTouched: (isTouched: boolean) => void;
  isValidReplicationRuleId: boolean;
  idError?: string;
  setIdError: (error: string | undefined) => void;
};

export function ReplicationRuleId({
  replicationRuleId,
  setReplicationRuleId,
  isReplicationRuleIdTouched,
  setIsReplicationRuleIdTouched,
  isValidReplicationRuleId,
  idError,
  setIdError,
}: TReplicationRuleIdProps) {
  const { t } = useTranslation([
    'containers/add',
    'containers/replication/add',
  ]);

  useEffect(() => {
    if (isReplicationRuleIdTouched && !replicationRuleId) {
      setIdError(t('pci-common:common_field_error_required'));
    } else if (isReplicationRuleIdTouched && !isValidReplicationRuleId) {
      setIdError(t('pci-common:common_field_error_pattern'));
    } else {
      setIdError(undefined);
    }
  }, [
    isReplicationRuleIdTouched,
    replicationRuleId,
    isValidReplicationRuleId,
    t,
  ]);

  return (
    <OdsFormField error={idError} className="max-w-[800px] block">
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
