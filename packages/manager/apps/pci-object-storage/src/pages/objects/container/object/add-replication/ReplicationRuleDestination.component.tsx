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
import {
  STATUS_ENABLED,
  ReplicationStorageClass,
  STATUS_DISABLED,
} from '@/constants';
import { TContainer } from '@/pages/dashboard/BucketPropertiesCard';
import { TServerContainer } from '@/api/data/container';
import { ContainerType } from './ManageReplicationPage.form';

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
  containerType?: ContainerType;
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

type TReplicationRuleDestinationProps = {
  destination: TReplicationDestination;
  setDestination: (destination: TReplicationDestination) => void;
  allStorages: TReplicationStorage[];
  setDestinationDetails: (destinationDetails: TReplicationStorage) => void;
  serverDestinationContainer: TServerContainer;
  asyncReplicationLink: string;
  setUseStorageclass: (useStorageclass: boolean) => void;
  container: TContainer;
};

export function ReplicationRuleDestination({
  destination,
  setDestination,
  allStorages,
  setDestinationDetails,
  serverDestinationContainer,
  asyncReplicationLink,
  setUseStorageclass,
  container,
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

  const showWarningVersioning =
    allStorages.length === 0 ||
    (serverDestinationContainer &&
      !(
        serverDestinationContainer?.versioning?.status === STATUS_ENABLED &&
        container?.versioning?.status === STATUS_ENABLED
      ));

  const showWarningMessageObjectLock =
    allStorages.length === 0 ||
    (serverDestinationContainer &&
      container?.objectLock?.status === STATUS_ENABLED &&
      serverDestinationContainer?.objectLock?.status === STATUS_DISABLED);

  return (
    <OdsFormField className="mt-8 max-w-[800px] block">
      <OdsText preset="heading-5">
        {t(
          'containers/replication/add:pci_projects_project_storages_containers_replication_add_destination',
        )}
      </OdsText>
      <OdsCombobox
        data-testid="replication-rule-combobox"
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

      {(showWarningVersioning || showWarningMessageObjectLock) && (
        <OdsMessage
          color="warning"
          className="mt-6"
          isDismissible={false}
          variant="default"
        >
          <span>
            {showWarningVersioning &&
              t(
                'containers/replication/add:pci_projects_project_storages_containers_replication_add_destination_warning',
              )}
            {showWarningMessageObjectLock && (
              <span className="ml-3">
                &nbsp;
                {t(
                  'containers/replication/add:pci_projects_project_storages_containers_replication_add_destination_warning_object_lock',
                )}
              </span>
            )}
            &nbsp;
            <Links
              href={asyncReplicationLink}
              target="_blank"
              type={LinkType.external}
              label={t(
                'containers/replication/add:pci_projects_project_storages_containers_replication_add_destination_warning_link',
              )}
            />
          </span>
        </OdsMessage>
      )}
    </OdsFormField>
  );
}
