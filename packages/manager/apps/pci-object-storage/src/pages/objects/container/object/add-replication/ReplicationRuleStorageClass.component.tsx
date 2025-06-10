import { useTranslation } from 'react-i18next';

import {
  OdsCheckbox,
  OdsFormField,
  OdsIcon,
  OdsPopover,
  OdsRadio,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { TReplicationDestination } from './ReplicationRuleDestination.component';
import { ReplicationStorage } from './AddReplication.page';
import { ReplicationStorageClass } from '@/constants';

interface TReplicationRuleStorageClassProps {
  destination: TReplicationDestination;
  useStorageclass: boolean;
  setUseStorageclass: (value: boolean) => void;
  storageClass: ReplicationStorageClass;
  setStorageClass: (value: ReplicationStorageClass) => void;
  destinationDetails: ReplicationStorage;
}
export function ReplicationRuleStorageClass({
  destination,
  useStorageclass,
  setUseStorageclass,
  storageClass,
  setStorageClass,
  destinationDetails,
}: TReplicationRuleStorageClassProps) {
  const { t } = useTranslation(['containers/replication/add']);

  return (
    <div className="mt-8 max-w-[800px] block">
      <OdsFormField className="flex">
        <span className="flex">
          <OdsCheckbox
            isDisabled={!destination?.name}
            className="mt-2"
            name="use-storageclass"
            inputId="use-storageclass"
            isChecked={useStorageclass}
            onOdsChange={() => setUseStorageclass(!useStorageclass)}
          />
          <label
            slot="label"
            className="text-[var(--ods-color-text)] ml-4 cursor-pointer"
            htmlFor="use-storageclass"
          >
            {t(
              'containers/replication/add:pci_projects_project_storages_containers_replication_add_use_storageclass',
            )}
          </label>
          {!destination?.name && (
            <div className="mt-2 ml-3 cursor-pointer">
              <OdsIcon
                id="trigger-popover"
                name="circle-question"
                className="text-[var(--ods-color-information-500)]"
              />
              <OdsPopover triggerId="trigger-popover">
                <OdsText preset="caption">
                  {t(
                    'containers/replication/add:pci_projects_project_storages_containers_replication_add_use_storageclass_tooltip',
                  )}
                </OdsText>
              </OdsPopover>
            </div>
          )}
        </span>
      </OdsFormField>

      {useStorageclass && (
        <div className="flex flex-col gap-4 mt-4 mb-4">
          <div className="flex items-center gap-4">
            <OdsRadio
              value="standard"
              name="storageClass"
              onOdsChange={() =>
                setStorageClass(ReplicationStorageClass.STANDARD)
              }
              inputId="storage-cLass-standard"
              isChecked={storageClass === ReplicationStorageClass.STANDARD}
            />
            <label htmlFor="storage-cLass-standard">
              <OdsText>
                {t(
                  'containers/replication/add:pci_projects_project_storages_containers_replication_add_storageclass_standard',
                )}
              </OdsText>
            </label>
          </div>
          <div className="flex items-center gap-4">
            <OdsRadio
              value="standard-ia"
              name="storageClass"
              onOdsChange={() =>
                setStorageClass(ReplicationStorageClass.STANDARD_IA)
              }
              inputId="storage-cLass-standard-ia"
              isChecked={storageClass === ReplicationStorageClass.STANDARD_IA}
            />
            <label htmlFor="storage-cLass-standard-ia">
              <OdsText>
                {t(
                  'containers/replication/add:pci_projects_project_storages_containers_replication_add_storageclass_standard_ia',
                )}
              </OdsText>
            </label>
          </div>
          {destinationDetails?.mode !==
            t(
              `containers:pci_projects_project_storages_containers_deployment_mode_region-3-az`,
            ) && (
            <div className="flex items-center gap-4">
              <OdsRadio
                value="high-perf"
                name="storageClass"
                onOdsChange={() =>
                  setStorageClass(ReplicationStorageClass.HIGH_PERF)
                }
                inputId="storage-class-high-perf"
                isChecked={storageClass === ReplicationStorageClass.HIGH_PERF}
              />
              <label htmlFor="storage-class-high-perf">
                <OdsText>
                  {t(
                    'containers/replication/add:pci_projects_project_storages_containers_replication_add_storageclass_high_perf',
                  )}
                </OdsText>
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
