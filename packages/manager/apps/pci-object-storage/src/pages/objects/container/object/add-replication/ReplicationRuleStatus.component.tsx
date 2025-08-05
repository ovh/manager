import { useTranslation } from 'react-i18next';

import {
  OdsRadio,
  OdsText,
  OdsFormField,
} from '@ovhcloud/ods-components/react';

import { STATUS_DISABLED, STATUS_ENABLED } from '@/constants';
import { TReplicationStatus } from './ManageReplicationPage.form';

type TReplicationRuleStatusProps = {
  replicationStatus: TReplicationStatus;
  setReplicationStatus: (status: TReplicationStatus) => void;
};
export function ReplicationRuleStatus({
  replicationStatus,
  setReplicationStatus,
}: TReplicationRuleStatusProps) {
  const { t } = useTranslation(['containers/replication/add']);

  return (
    <OdsFormField className="mt-8 max-w-[800px] block">
      <label slot="label">
        {t(
          'containers/replication/add:pci_projects_project_storages_containers_replication_add_status',
        )}
      </label>
      <div className="flex flex-col gap-4 mt-4 mb-4">
        <div className="flex items-center gap-4">
          <OdsRadio
            value="enabled"
            name="replication-status"
            onOdsChange={() => setReplicationStatus(STATUS_ENABLED)}
            inputId="replication-status-true"
            isChecked={replicationStatus === STATUS_ENABLED}
          />
          <label htmlFor="replication-status-true">
            <OdsText>
              {t(
                'containers/replication/add:pci_projects_project_storages_containers_replication_add_status_enabled',
              )}
            </OdsText>
          </label>
        </div>
        <div className="flex items-center gap-4">
          <OdsRadio
            value="disabled"
            isChecked={replicationStatus === STATUS_DISABLED || undefined}
            name="replication-status"
            inputId="replication-status-false"
            onOdsChange={() => setReplicationStatus(STATUS_DISABLED)}
          />
          <label htmlFor="replication-status-false">
            <OdsText>
              <span>
                {t(
                  'containers/replication/add:pci_projects_project_storages_containers_replication_add_status_disabled',
                )}
              </span>
            </OdsText>
          </label>
        </div>
      </div>
    </OdsFormField>
  );
}
