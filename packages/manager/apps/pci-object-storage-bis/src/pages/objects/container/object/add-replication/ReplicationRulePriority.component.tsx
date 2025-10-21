import { useTranslation } from 'react-i18next';

import {
  OdsFormField,
  OdsQuantity,
  OdsText,
} from '@ovhcloud/ods-components/react';
import clsx from 'clsx';

import { OdsInputChangeEvent } from '@ovhcloud/ods-components';
import { ReplicationStorageClass } from '@/constants';

export type ReplicationDestination = {
  name: string;
  region: string;
  storageClass?: ReplicationStorageClass;
};

export const DEFAULT_PRIORITY = 1;
export const MAX_PRIORITY = 1000;

export type TReplicationRulePriorityProps = {
  handlePriorityChange: (event: OdsInputChangeEvent) => void;
  priority: number;
  priorityError: boolean | undefined;
};

export function ReplicationRulePriority({
  handlePriorityChange,
  priority,
  priorityError,
}: TReplicationRulePriorityProps) {
  const { t } = useTranslation(['containers/replication/add']);

  return (
    <OdsFormField className="mt-8 max-w-[800px] block">
      <label slot="label">
        {t(
          'containers/replication/add:pci_projects_project_storages_containers_replication_add_priority',
        )}
      </label>

      <div className="mt-4">
        <OdsQuantity
          data-testid="replication-rule-priority-input"
          onOdsChange={handlePriorityChange}
          value={priority}
          min={DEFAULT_PRIORITY}
          max={MAX_PRIORITY}
          step={1}
          name="priority"
          className={clsx(priorityError && 'priority-error')}
        />
      </div>
      <OdsText
        slot="helper"
        preset="caption"
        className={clsx('max-w-2xl mt-3', priorityError && 'text-critical')}
      >
        {t(
          'containers/replication/add:pci_projects_project_storages_containers_replication_add_priority_helper_text',
        )}
      </OdsText>
      {priorityError && (
        <div>
          <OdsText className="text-critical">
            {t(
              'containers/replication/add:pci_projects_project_storages_containers_replication_add_priority_error',
              { priority },
            )}
          </OdsText>
        </div>
      )}
    </OdsFormField>
  );
}
