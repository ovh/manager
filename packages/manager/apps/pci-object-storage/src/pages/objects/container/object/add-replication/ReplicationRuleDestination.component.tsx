import { useTranslation } from 'react-i18next';
import { Links, LinkType } from '@ovh-ux/manager-react-components';
import {
  OdsCombobox,
  OdsComboboxItem,
  OdsFormField,
  OdsMessage,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { STATUS_ENABLED } from '@/constants';

export type ReplicationDestination = {
  name: string;
  region: string;
  storageClass?: 'STANDARD' | 'STANDARD_IA' | 'HIGH_PERF';
};

export function ReplicationRuleDestination({
  destination,
  setDestination,
  allStorages,
  setDestinationDetails,
  serverDestinationContainer,
  asyncReplicationLink,
  setUseStorageclass,
}) {
  const { t } = useTranslation(['containers/replication/add']);

  return (
    <OdsFormField className="mt-8 w-[676px] block">
      <label slot="label">
        {t(
          'containers/replication/add:pci_projects_project_storages_containers_replication_add_destination',
        )}
      </label>
      <OdsCombobox
        placeholder={t(
          'containers/replication/add:pci_projects_project_storages_containers_replication_add_destination_placeholder',
        )}
        name="destination"
        className="w-full mt-4"
        value={destination?.name}
        onOdsChange={(event) => {
          const storage = allStorages?.find(
            (element) => element.name === event.detail.value,
          );
          if (storage) {
            const replicationDestination: ReplicationDestination = {
              name: storage.name,
              region: storage.region,
            };
            setDestinationDetails(storage);
            setDestination(replicationDestination);
          } else {
            setDestination(null);
            setUseStorageclass(false);
          }
        }}
      >
        {allStorages.map((storage) => (
          <OdsComboboxItem value={storage.name}>{storage.name}</OdsComboboxItem>
        ))}
      </OdsCombobox>
      <OdsText slot="helper" preset="caption" className="max-w-2xl">
        {t(
          'containers/replication/add:pci_projects_project_storages_containers_replication_add_destination_helper_text',
        )}
      </OdsText>

      {(allStorages.length === 0 ||
        (serverDestinationContainer?.versioning &&
          !(
            serverDestinationContainer.versioning?.status === STATUS_ENABLED
          ))) && (
        <OdsMessage color="warning" className="mt-6" isDismissible={false}>
          <OdsText preset="paragraph">
            {t(
              'containers/replication/add:pci_projects_project_storages_containers_replication_add_destination_warning',
            )}
            <Links
              className="ml-4"
              href={asyncReplicationLink}
              target="_blank"
              type={LinkType.external}
              label={t(
                'containers/replication/add:pci_projects_project_storages_containers_replication_add_destination_warning_link',
              )}
            />
          </OdsText>
        </OdsMessage>
      )}
    </OdsFormField>
  );
}
