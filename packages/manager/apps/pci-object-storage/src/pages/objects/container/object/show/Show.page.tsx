import { Suspense, useContext, useEffect, useMemo, useState } from 'react';
import {
  Outlet,
  useHref,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import {
  BaseLayout,
  Links,
  LinkType,
  Notifications,
  PciGuidesHeader,
  PciMaintenanceBanner,
  useColumnFilters,
  useDataGrid,
  useMe,
  useNotifications,
  useProductMaintenance,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useBytes, useProject } from '@ovh-ux/manager-pci-common';
import {
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { FilterCategories, FilterComparator } from '@ovh-ux/manager-core-api';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsMessage,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { ColumnSort } from '@tanstack/react-table';
import {
  usePaginatedObjects,
  useServerContainer,
} from '@/api/hooks/useContainer';
import { useDatagridColumn } from './useDatagridColumn';

import {
  BACKUP_KEY,
  NO_ENCRYPTION_VALUE,
  OBJECT_CONTAINER_MODE_LOCAL_ZONE,
  OBJECT_CONTAINER_MODE_MONO_ZONE,
  OBJECT_CONTAINER_MODE_MULTI_ZONES,
  STORAGE_ASYNC_REPLICATION_LINK,
  TRACKING,
  MUMBAI_REGION_NAME,
  STATUS_ENABLED,
  STATUS_DISABLED,
  STATUS_SUSPENDED,
  UNIVERSE,
  SUB_UNIVERSE,
  APP_NAME,
} from '@/constants';
import { useGetRegion } from '@/api/hooks/useRegion';
import { useStorage, useStorageEndpoint } from '@/api/hooks/useStorages';
import { TServerContainer } from '@/api/data/container';
import { useGetEncriptionAvailability } from '@/api/hooks/useGetEncriptionAvailability';
import { TRegion } from '@/api/data/region';

import { useServerContainerObjects } from '@/api/hooks/useContainerObjects';
import './style.scss';
import { useSortedObjects } from './useSortedObjectsWithIndex';
import { ContainerDatagrid } from './ContainerDataGrid';
import { ContainerInfoPanel } from './ContainerInfoPanel';
import UseStandardInfrequentAccessAvailability from '@/hooks/useStandardInfrequentAccessAvailability';

export type TContainer = {
  id: string;
  objectsCount: number;
  usedSpace: string | number;
  publicUrl: string;
  s3StorageType: string;
  staticUrl: string;
  regionDetails?: TRegion;
  tags?: TTags;
} & TServerContainer;

export type TTags = {
  [key: string]: string;
};

const trackAction = (actionType: 'page' | 'funnel', specificAction: string) => {
  let additionalActions: string[] = [];

  if (actionType === 'page') {
    additionalActions = ['page', 'button', specificAction];
  } else if (actionType === 'funnel') {
    additionalActions = ['funnel', 'tile-tutorial', specificAction];
  }

  return {
    actions: [UNIVERSE, SUB_UNIVERSE, APP_NAME, ...additionalActions],
  };
};

export default function ObjectPage() {
  const { storageId } = useParams();
  const [searchParams] = useSearchParams();
  const { data: project } = useProject();
  const { trackClick } = useOvhTracking();

  const [search, setSearch] = useState<string | null>(null);
  const [prefix, setPrefix] = useState<string | null>(null);

  useEffect(() => {
    if (prefix !== null && search === '') {
      setPrefix(null);
    }
  }, [search, prefix]);

  const handlePrefixChange = (handleKey: string | null) => {
    setPrefix(handleKey);
  };

  const { tracking } = useContext(ShellContext).shell;

  const { hasMaintenance, maintenanceURL } = useProductMaintenance(
    project?.project_id,
  );

  const { me } = useMe();

  const { formatBytes } = useBytes();

  const hrefProject = useProjectUrl('public-cloud');
  const { t: tObjects } = useTranslation('objects');
  const { t: tContainer } = useTranslation('container');
  const { t: tCommon } = useTranslation('pci-common');

  const { t: tAdd } = useTranslation('containers/add');

  const objectStorageHref = useHref('..');
  const enableVersioningHref = useHref(
    `./enableVersioning?region=${searchParams.get('region')}`,
  );
  const enableEncryptionHref = useHref(
    `./enableEncryption?region=${searchParams.get('region')}`,
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

  const { data: serverContainer, isPending } = useServerContainer(
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

  const [enableVersionsToggle, setEnableVersionsToggle] = useState(false);

  const {
    data: containerObjects,
    isLoading: isObjectsLoading,
    refetch: refetchContainerObjects,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useServerContainerObjects({
    projectId: project?.project_id,
    region: searchParams.get('region'),
    name: storageId,
    withVersions: enableVersionsToggle,
    isS3StorageType: container?.s3StorageType,
    prefix,
  });

  useEffect(() => {
    if (container?.s3StorageType) {
      refetchContainerObjects();
    }
  }, [
    storageId,
    searchParams.get('region'),
    enableVersionsToggle,
    storages,
    container,
    searchParams.get('refetch'),
    refetchContainerObjects,
  ]);

  const handleFetchNextPage = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const [sortingDatagrid, setSortingDatagrid] = useState<ColumnSort | null>(
    null,
  );

  const containerObjectsWithIndex = useSortedObjects(
    containerObjects,
    sortingDatagrid,
    container?.s3StorageType,
  );

  const shouldHideButton = useMemo(() => {
    return !container?.tags?.[BACKUP_KEY];
  }, [container]);

  const hasStandardInfrequentAccess = UseStandardInfrequentAccessAvailability();

  const is = {
    localZone: useMemo(
      () => region?.type === OBJECT_CONTAINER_MODE_LOCAL_ZONE,
      [region],
    ),
    encrypted: useMemo(() => {
      const { sseAlgorithm } = serverContainer?.encryption || {};
      return sseAlgorithm && sseAlgorithm !== NO_ENCRYPTION_VALUE;
    }, [serverContainer]),
    rightOffer: useMemo(() => !!container?.s3StorageType, [container]),
    replicationRulesBannerShown: useMemo(() => {
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
    }, [container, region]),
  };

  const REPLICATION_LINK =
    STORAGE_ASYNC_REPLICATION_LINK[me?.ovhSubsidiary] ||
    STORAGE_ASYNC_REPLICATION_LINK.DEFAULT;

  const { available: isEncryptionAvailable } = useGetEncriptionAvailability();

  const displayEncryptionData = useMemo<boolean>(() => {
    return isEncryptionAvailable && !!container?.s3StorageType;
  }, [isEncryptionAvailable, serverContainer]);

  const columns = useDatagridColumn({
    container,
    isLocalZone: !!is.localZone,
  });

  const objectsColumns = useDatagridColumn({
    container,
    isLocalZone: !!is.localZone,
    shouldSeeVersions: true,
    enableVersionsToggle,
    shouldSeeSearch: true,
  });

  const filterColumns = useMemo(
    () => [
      {
        id: 'name',
        label: tContainer(
          'pci_projects_project_storages_containers_container_name_label',
        ),
        comparators: FilterCategories.String,
      },
      {
        id: 'lastModified',
        label: tContainer(
          'pci_projects_project_storages_containers_container_lastModified_label',
        ),
        comparators: FilterCategories.Date,
      },
      {
        id: 'storageClass',
        label: tContainer(
          'pci_projects_project_storages_containers_container_storage_class_label',
        ),
        comparators: FilterCategories.String,
      },
    ],
    [],
  );
  const navigate = useNavigate();
  const { clearNotifications } = useNotifications();

  const { filters, addFilter, removeFilter } = useColumnFilters();
  const [searchField, setSearchField] = useState('');

  const { pagination, setPagination, sorting, setSorting } = useDataGrid();

  const { paginatedObjects } = usePaginatedObjects(
    project?.project_id,
    searchParams.get('region'),
    targetContainer?.name,
    targetContainer?.id,
    pagination,
    sorting,
    filters,
  );

  const handleSearch = () => {
    setPagination({
      pageIndex: 0,
      pageSize: pagination.pageSize,
    });
    addFilter({
      key: 'search',
      value: searchField,
      comparator: FilterComparator.Includes,
      label: '',
    });
    setSearchField('');
  };

  useEffect(() => {
    clearNotifications();
  }, []);

  const onGuidesClick = () => {
    trackClick(trackAction('funnel', 'go-to-tutorial'));
  };

  if (!container || !url) {
    return <OdsSpinner size="md" />;
  }

  const handleAddObjectClick = () => {
    clearNotifications();
    navigate(`./new?region=${searchParams.get('region')}`);
  };

  return (
    <BaseLayout
      breadcrumb={
        <OdsBreadcrumb>
          <OdsBreadcrumbItem href={hrefProject} label={project?.description} />
          <OdsBreadcrumbItem
            href={objectStorageHref}
            label={tObjects(
              'pci_projects_project_storages_containers_object_title',
            )}
          />
          <OdsBreadcrumbItem href="" label={container?.name} />
        </OdsBreadcrumb>
      }
      header={{
        title: container.name,
        headerButton: (
          <span onClick={onGuidesClick}>
            <PciGuidesHeader category="objectStorage" />
          </span>
        ),
      }}
      backLinkLabel={`
        ${tCommon('common_back_button_back_to')} ${tContainer(
        'pci_projects_project_storages_containers_container_back_button_label',
      )}`}
      hrefPrevious={objectStorageHref}
    >
      <Notifications />

      {hasMaintenance && (
        <PciMaintenanceBanner maintenanceURL={maintenanceURL} />
      )}

      {is.replicationRulesBannerShown && (
        <OdsMessage color="information" className="mt-6" isDismissible={false}>
          <OdsText>
            {tContainer(
              'pci_projects_project_storages_containers_container_add_replication_rules_info',
            )}
            <Links
              className="ml-4"
              href={REPLICATION_LINK}
              target="_blank"
              type={LinkType.external}
              label={tAdd(
                'pci_projects_project_storages_containers_add_replication_rules_info_link',
              )}
            />
          </OdsText>
        </OdsMessage>
      )}

      {container && (
        <>
          <ContainerInfoPanel
            container={container}
            isLocalZone={is.localZone}
            isRightOffer={is.rightOffer}
            isEncrypted={is.encrypted}
            displayEncryptionData={displayEncryptionData}
            isReplicationRulesBannerShown={is.replicationRulesBannerShown}
            region={region}
            enableEncryptionHref={enableEncryptionHref}
            enableVersioningHref={enableVersioningHref}
            tracking={tracking}
            trackClick={trackClick}
            trackAction={trackAction}
          />

          <ContainerDatagrid
            isS3StorageType={!!container?.s3StorageType}
            isRightOffer={is.rightOffer}
            isLocalZone={!!is.localZone}
            versioningStatus={container.versioning?.status}
            handleAddObjectClick={handleAddObjectClick}
            enableVersionsToggle={enableVersionsToggle}
            setEnableVersionsToggle={setEnableVersionsToggle}
            objectsColumns={objectsColumns}
            sortingDatagrid={sortingDatagrid}
            setSortingDatagrid={setSortingDatagrid}
            hasNextPage={hasNextPage}
            isObjectsLoading={isObjectsLoading}
            containerObjectsWithIndex={containerObjectsWithIndex}
            containerObjects={containerObjects}
            handleFetchNextPage={handleFetchNextPage}
            search={search}
            setSearch={setSearch}
            handlePrefixChange={handlePrefixChange}
            filterColumns={filterColumns}
            searchField={searchField}
            setSearchField={setSearchField}
            handleSearch={handleSearch}
            filters={filters}
            removeFilter={removeFilter}
            isPending={isPending}
            columns={columns}
            paginatedObjects={paginatedObjects}
            pagination={pagination}
            setPagination={setPagination}
            sorting={sorting}
            setSorting={setSorting}
            addFilter={addFilter}
            shouldHideButton={shouldHideButton}
            hasStandardInfrequentAccess={hasStandardInfrequentAccess}
            trackClick={trackClick}
            trackAction={trackAction}
          />
        </>
      )}
      <Suspense>
        <Outlet />
      </Suspense>
    </BaseLayout>
  );
}
