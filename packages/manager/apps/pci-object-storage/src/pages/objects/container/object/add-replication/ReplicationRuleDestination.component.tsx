import { useTranslation } from 'react-i18next';
import { Links, LinkType } from '@ovh-ux/manager-react-components';
import {
  OdsCombobox,
  OdsComboboxItem,
  OdsFormField,
  OdsMessage,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { OdsInputChangeEvent } from '@ovhcloud/ods-components';
import { STATUS_ENABLED, ReplicationStorageClass } from '@/constants';

export type TReplicationDestination = {
  name: string;
  region: string;
  storageClass?: ReplicationStorageClass;
};

export type TReplicationStorage = {
  mode: string;
  offer: string;
  deploymentMode: string;
  containerCount: number;
  usedSpace: number;
  archive?: boolean;
  containerType?: 'private' | 'public' | 'static';
  id: string;
  name: string;
  region: string;
  state?: string;
  encryption?: { sseAlgorithm: string };
  versioning?: {
    status: string;
  };
  replication?: {
    rules: {
      id: string;
      status: 'enabled' | 'disabled';
      priority: number;
      destination: TReplicationDestination;
      deleteMarkerReplication: 'enabled' | 'disabled';
      filter?: { prefix: string; tags: { [key: string]: string } };
    }[];
  };
};
type TServerDestinationContainer = {
  versioning: {
    status: string;
  };
};

type TReplicationRuleDestinationProps = {
  destination: TReplicationDestination;
  setDestination: (destination: TReplicationDestination) => void;
  allStorages: TReplicationStorage[];
  setDestinationDetails: (destinationDetails: TReplicationStorage) => void;
  serverDestinationContainer: TServerDestinationContainer;
  asyncReplicationLink: string;
  setUseStorageclass: (useStorageclass: boolean) => void;
};

export function ReplicationRuleDestination({
  destination,
  setDestination,
  allStorages,
  setDestinationDetails,
  serverDestinationContainer,
  asyncReplicationLink,
  setUseStorageclass,
}: TReplicationRuleDestinationProps) {
  const { t } = useTranslation(['containers/replication/add']);

  const handleDestinationChange = (event: OdsInputChangeEvent) => {
    const storage = allStorages?.find(
      (element) => element.name === event.detail.value,
    );

    if (storage) {
      const replicationDestination: TReplicationDestination = {
        name: storage.name,
        region: storage.region,
      };

      setDestinationDetails(storage);
      setDestination(replicationDestination);
    } else {
      setDestination(null);
      setUseStorageclass(false);
    }
  };

  return (
    <OdsFormField className="mt-8 max-w-[800px] block">
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
        onOdsChange={handleDestinationChange}
        allowNewElement={false}
      >
        {allStorages.map((storage) => (
          <OdsComboboxItem key={storage.name} value={storage.name}>
            {storage.name}
          </OdsComboboxItem>
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
