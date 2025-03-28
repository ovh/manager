import { Suspense, useEffect, useMemo } from 'react';
import { Outlet, useHref, useParams, useSearchParams } from 'react-router-dom';
import {
  BaseLayout,
  Datagrid,
  Notifications,
  PciGuidesHeader,
  PciMaintenanceBanner,
  useNotifications,
  useProductMaintenance,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useBytes, useProject } from '@ovh-ux/manager-pci-common';

import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsSpinner,
} from '@ovhcloud/ods-components/react';

import { useServerContainer } from '@/api/hooks/useContainer';
import { useDatagridColumn } from '../show/useDatagridColumn';
import {
  NO_ENCRYPTION_VALUE,
  OBJECT_CONTAINER_MODE_LOCAL_ZONE,
  OBJECT_CONTAINER_MODE_MONO_ZONE,
  OBJECT_CONTAINER_MODE_MULTI_ZONES,
} from '@/constants';
import { useGetRegion } from '@/api/hooks/useRegion';
import { useStorage, useStorageEndpoint } from '@/api/hooks/useStorages';

import '../show/style.scss';
import { useServerContainerObjectVersions } from '@/api/hooks/useContainerObjectVersions';
import { TContainer } from '../show/Show.page';

export default function ObjectPage() {
  const { storageId, objectName } = useParams();

  const [searchParams] = useSearchParams();
  const { data: project } = useProject();

  const { hasMaintenance, maintenanceURL } = useProductMaintenance(
    project?.project_id,
  );

  const { formatBytes } = useBytes();

  const hrefProject = useProjectUrl('public-cloud');
  const { t } = useTranslation(['objects', 'container']);

  const objectStorageHref = useHref('..');
  const containerDetailsHref = useHref(
    `../${storageId}?region=${searchParams.get('region')}`,
  );

  const { data: region } = useGetRegion(
    project?.project_id,
    searchParams.get('region'),
  );

  const { storage: targetContainer, storages } = useStorage(
    project?.project_id,
    storageId,
    searchParams.get('region'),
  );

  const { url } = useStorageEndpoint(project?.project_id, targetContainer);

  const { data: serverContainer } = useServerContainer(
    project?.project_id,
    searchParams.get('region'),
    targetContainer?.name,
    targetContainer?.id,
  );

  const container = useMemo((): TContainer => {
    if (!serverContainer) return undefined;
    const s3StorageType = targetContainer?.s3StorageType;

    return {
      ...serverContainer,
      id: serverContainer?.id || targetContainer?.id,
      name: serverContainer?.name || targetContainer?.name,
      objectsCount:
        serverContainer?.storedObjects || serverContainer?.objectsCount,
      usedSpace: formatBytes(
        serverContainer?.storedBytes || serverContainer?.objectsSize,
        2,
        1024,
      ),
      publicUrl: url,
      s3StorageType,
      regionDetails: s3StorageType ? region : undefined,
      staticUrl: serverContainer?.staticUrl || serverContainer?.virtualHost,
    };
  }, [serverContainer, region, targetContainer, url]);

  const {
    data: objectsVersions,
    isLoading: isObjectsLoading,
    refetch: refetchObjectVersions,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useServerContainerObjectVersions({
    projectId: project?.project_id,
    region: searchParams.get('region'),
    name: storageId,
    key: encodeURIComponent(objectName),
    isS3StorageType: container?.s3StorageType,
  });

  useEffect(() => {
    if (container?.s3StorageType) {
      refetchObjectVersions();
    }
  }, [
    storageId,
    searchParams.get('region'),
    storages,
    container,
    searchParams.get('refetch'),
    refetchObjectVersions,
  ]);

  const handleFetchNextPage = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const containerObjectsWithIndex = useMemo(() => {
    if (!objectsVersions && !container?.s3StorageType) return [];
    return objectsVersions?.map((object, index) => ({
      ...object,
      index: `${index}`,
    }));
  }, [objectsVersions]);

  const is = useMemo(
    () => ({
      localZone: region?.type === OBJECT_CONTAINER_MODE_LOCAL_ZONE,
      encrypted: (() => {
        const { sseAlgorithm } = serverContainer?.encryption || {};
        return sseAlgorithm && sseAlgorithm !== NO_ENCRYPTION_VALUE;
      })(),
      rightOffer: !!container?.s3StorageType,
      replicationRulesBannerShown: (() => {
        const hasEnabledRule = container?.replication?.rules?.some(
          (rule) => rule.status === 'enabled',
        );

        const validTypes = [
          OBJECT_CONTAINER_MODE_MONO_ZONE,
          OBJECT_CONTAINER_MODE_MULTI_ZONES,
        ];
        return (
          !hasEnabledRule && validTypes.includes(container?.regionDetails?.type)
        );
      })(),
    }),
    [region, serverContainer, container],
  );

  const objectsColumns = useDatagridColumn({
    container,
    isLocalZone: !!is.localZone,
    shouldSeeVersions: false,
    isLastElement: objectsVersions?.length === 1,
  });

  const { clearNotifications } = useNotifications();

  useEffect(() => {
    clearNotifications();
  }, []);

  if (!container || !url) {
    return <OdsSpinner size="md" />;
  }

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
          <OdsBreadcrumbItem href="" label={objectName} />
        </OdsBreadcrumb>
      }
      header={{
        title: objectName,
        headerButton: <PciGuidesHeader category="objectStorage" />,
      }}
      backLinkLabel={t(
        'container:pci_projects_project_storages_containers_container_back_to_versions',
      )}
      hrefPrevious={containerDetailsHref}
    >
      <Notifications />

      {hasMaintenance && (
        <PciMaintenanceBanner maintenanceURL={maintenanceURL} />
      )}

      {container && (
        <>
          {container?.s3StorageType &&
            (!isObjectsLoading ? (
              <div className="mt-8">
                <Datagrid
                  columns={objectsColumns}
                  hasNextPage={hasNextPage}
                  items={containerObjectsWithIndex}
                  onFetchNextPage={handleFetchNextPage}
                  totalItems={objectsVersions.length}
                />
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
