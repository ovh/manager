import { useTranslation } from 'react-i18next';

import {
  OdsFormField,
  OdsInput,
  OdsText,
} from '@ovhcloud/ods-components/react';

import clsx from 'clsx';
import { TFunction } from 'i18next';

type TReplicationRuleIdProps = {
  replicationRuleId: string;
  setReplicationRuleId: (value: string) => void;
  isReplicationRuleIdTouched: boolean;
  setIsReplicationRuleIdTouched: (isTouched: boolean) => void;
  isValidReplicationRuleId: boolean;
};

const getErrorMessage = (
  isValidReplicationRuleId: boolean,
  isReplicationRuleIdTouched: boolean,
  replicationRuleId: string,
  t: TFunction,
) => {
  let idError: string | undefined;

  if (isReplicationRuleIdTouched && !isValidReplicationRuleId) {
    idError = t('pci-common:common_field_error_pattern');
  }

  if (isReplicationRuleIdTouched && !replicationRuleId) {
    idError = t('pci-common:common_field_error_required');
  }

  return idError;
};

export function ReplicationRuleId({
  replicationRuleId,
  setReplicationRuleId,
  isReplicationRuleIdTouched,
  setIsReplicationRuleIdTouched,
  isValidReplicationRuleId,
}: TReplicationRuleIdProps) {
  const { t } = useTranslation([
    'containers/add',
    'containers/replication/add',
  ]);

  const idError = getErrorMessage(
    isValidReplicationRuleId,
    isReplicationRuleIdTouched,
    replicationRuleId,
    t,
  );

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
