import { Suspense, useEffect, useMemo } from 'react';
import {
  Outlet,
  useHref,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import {
  BaseLayout,
  Datagrid,
  Links,
  LinkType,
  Notifications,
  PciGuidesHeader,
  PciMaintenanceBanner,
  useNotifications,
  useProductMaintenance,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useProject } from '@ovh-ux/manager-pci-common';

import {
  OdsBreadcrumb,
  OdsButton,
  OdsBreadcrumbItem,
  OdsSpinner,
  OdsText,
  OdsMessage,
  OdsTooltip,
} from '@ovhcloud/ods-components/react';

import { useServerContainer } from '@/api/hooks/useContainer';
import { useDatagridColumn } from './useDatagridColumn';

import { useGetRegion } from '@/api/hooks/useRegion';
import {
  useAllServerStorages,
  useStorage,
  useStorageEndpoint,
} from '@/api/hooks/useStorages';

import '../show/style.scss';

import { ReplicationStorageClass, STATUS_ENABLED } from '@/constants';
import { useStorageFeatures } from '@/hooks/useStorageFeatures';
import { useMergedContainer } from '@/hooks/useContainerMemo';
import { downloadReplicationRules } from '@/api/data/dowloadReplicationRule';

export type TSortedReplications = {
  [index: number]: TReplication;
} & Array<TReplication>;

export type TReplicationDestinationWithStorageClass = {
  name: string;
  region: string;
  storageClass: ReplicationStorageClass;
};

export type TReplication = {
  id: string;
  status: 'enabled' | 'disabled';
  priority: number;
  destination: TReplicationDestinationWithStorageClass;
  deleteMarkerReplication: 'enabled' | 'disabled';
  filter?: {
    prefix: string;
    tags: {
      [key: string]: string;
    };
  };
};

export default function ReplicationListPage() {
  const { storageId, projectId } = useParams();

  const [searchParams] = useSearchParams();
  const { data: project } = useProject();

  const { hasMaintenance, maintenanceURL } = useProductMaintenance(
    project?.project_id,
  );

  const hrefProject = useProjectUrl('public-cloud');

  const { t } = useTranslation(['objects', 'containers/replication']);
  const navigate = useNavigate();

  const objectStorageHref = useHref('..');
  const containerDetailsHref = useHref(
    `../${storageId}?region=${searchParams.get('region')}`,
  );

  const enableVersioningHref = useHref(
    `./enableVersioning?region=${searchParams.get('region')}`,
  );

  const { data: region } = useGetRegion(
    project?.project_id,
    searchParams.get('region'),
  );

  const { storage: targetContainer } = useStorage(
    project?.project_id,
    storageId,
    searchParams.get('region'),
  );

  const { url } = useStorageEndpoint(project?.project_id, targetContainer);

  const { data: serverContainer, isLoading } = useServerContainer(
    project?.project_id,
    searchParams.get('region'),
    targetContainer?.name,
    targetContainer?.id,
  );

  const container = useMergedContainer(
    serverContainer,
    targetContainer,
    url,
    region,
  );

  const sortedReplications: TSortedReplications = useMemo(() => {
    if (!container?.replication?.rules) return [];
    return container?.replication?.rules
      .map((replication, index) => ({
        ...replication,
        index: `${index}`,
      }))
      .sort((a, b) => b.priority - a.priority)
      .sort((a, b) => b.destination.name.localeCompare(a.destination.name));
  }, [container?.replication?.rules]);

  const { is3azAvailable, isLocalZoneAvailable } = useStorageFeatures();
  const { allStorages } = useAllServerStorages(projectId, {
    isLocalZoneAvailable,
    is3azAvailable,
  });

  const filteredStorages = useMemo(() => {
    return allStorages.filter(
      (storage) =>
        !(
          storage.name === container?.name &&
          storage.region === container?.region
        ),
    );
  }, [allStorages, container]);

  const createContainerHref = useHref('../new');

  const replicationsColumns = useDatagridColumn();

  const { clearNotifications } = useNotifications();

  useEffect(() => {
    clearNotifications();
  }, []);

  if (!container || !url) {
    return <OdsSpinner size="md" />;
  }

  const hasInvalidReplication = sortedReplications.some(
    (replication) => !replication.destination.region,
  );

  const isCreateButtonDisabled =
    !(container.versioning?.status === STATUS_ENABLED) ||
    filteredStorages.length === 0 ||
    hasInvalidReplication;

  const downloadRules = () => {
    downloadReplicationRules(container?.replication?.rules, projectId);
  };

  return (
    <BaseLayout
      breadcrumb={
        <OdsBreadcrumb>
          <OdsBreadcrumbItem href={hrefProject} label={project?.description} />
          <OdsBreadcrumbItem
            href={objectStorageHref}
            label={t(
              'objects:pci_projects_project_storages_containers_object_title',
            )}
          />
          <OdsBreadcrumbItem
            href={containerDetailsHref}
            label={container.name}
          />
          <OdsBreadcrumbItem
            href=""
            label={t(
              'containers/replication:pci_projects_project_storages_containers_replication_list_sub_title',
            )}
          />
        </OdsBreadcrumb>
      }
      header={{
        title: container.name,

        headerButton: <PciGuidesHeader category="objectStorage" />,
      }}
      backLinkLabel={t(
        'containers/replication:pci_projects_project_storages_containers_replication_list_back_to_objects',
      )}
      hrefPrevious={containerDetailsHref}
    >
      <Notifications />

      {hasMaintenance && (
        <PciMaintenanceBanner maintenanceURL={maintenanceURL} />
      )}

      {container.versioning?.status !== STATUS_ENABLED && (
        <OdsMessage
          color="warning"
          className="mt-6"
          isDismissible={false}
          variant="default"
        >
          <span>
            {t(
              'containers/replication:pci_projects_project_storages_containers_replication_list_warning',
            )}
            &nbsp;
            <Links
              href={enableVersioningHref}
              type={LinkType.next}
              label={t(
                'containers/replication:pci_projects_project_storages_containers_replication_list_warning_link',
              )}
            />
          </span>
        </OdsMessage>
      )}

      {filteredStorages.length === 0 && (
        <OdsMessage
          color="warning"
          className="mt-6"
          isDismissible={false}
          variant="default"
        >
          <span>
            {t(
              'containers/replication:pci_projects_project_storages_containers_replication_list_destination_warning',
            )}
            &nbsp;
            <Links
              href={createContainerHref}
              type={LinkType.next}
              label={t(
                'containers/replication:pci_projects_project_storages_containers_replication_list_destination_warning_link',
              )}
            />
          </span>
        </OdsMessage>
      )}

      {hasInvalidReplication && (
        <OdsMessage
          color="warning"
          className="mt-6"
          isDismissible={false}
          variant="default"
        >
          {t(
            'containers/replication:pci_projects_project_storages_containers_replication_conflict_warning',
          )}
        </OdsMessage>
      )}

      {container && (
        <>
          {container?.s3StorageType &&
            (!isLoading ? (
              <div className="mt-9 ">
                <OdsText preset="heading-4" className="mt-6 block">
                  {t(
                    'containers/replication:pci_projects_project_storages_containers_replication_list_sub_title',
                  )}
                </OdsText>
                <OdsText preset="paragraph" className="mt-4 block mb-6">
                  {t(
                    'containers/replication:pci_projects_project_storages_containers_replication_list_description',
                  )}
                </OdsText>
                <div className="flex justify-between items-center">
                  <OdsButton
                    isDisabled={isCreateButtonDisabled}
                    onClick={() => {
                      clearNotifications();
                      navigate(`./new?region=${searchParams.get('region')}`);
                    }}
                    label={t(
                      `containers/replication:pci_projects_project_storages_containers_replication_list_add_replication_rule`,
                    )}
                    icon="plus"
                    size="sm"
                  />

                  {!isCreateButtonDisabled && (
                    <div>
                      <OdsButton
                        id="trigger-tooltip"
                        icon="download"
                        label=""
                        color="primary"
                        variant="outline"
                        onClick={downloadRules}
                      />

                      <OdsTooltip triggerId="trigger-tooltip">
                        <OdsText preset="caption">
                          {t(
                            'containers/replication:pci_projects_project_storages_containers_replication_list_add_download_tooltip',
                          )}
                        </OdsText>
                      </OdsTooltip>
                    </div>
                  )}
                </div>

                <div className="mt-8 ">
                  <Datagrid
                    columns={replicationsColumns}
                    items={sortedReplications}
                    totalItems={sortedReplications?.length}
                  />
                </div>
              </div>
            ) : (
              <OdsSpinner />
            ))}
        </>
      )}
      <Suspense>
        <Outlet />
      </Suspense>
    </BaseLayout>
  );
}
