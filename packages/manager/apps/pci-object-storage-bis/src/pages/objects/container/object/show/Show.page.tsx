import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Outlet,
  useHref,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import {
  BaseLayout,
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
import { TabsPanel, useProject } from '@ovh-ux/manager-pci-common';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { FilterCategories, FilterComparator } from '@ovh-ux/manager-core-api';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsSpinner,
} from '@ovhcloud/ods-components/react';

import {
  BACKUP_KEY,
  STORAGE_ASYNC_REPLICATION_LINK,
  UNIVERSE,
  SUB_UNIVERSE,
  APP_NAME,
} from '@/constants';
import { useContainerData } from '@/hooks/useContainerData';
import { useServerContainerObjects } from '@/api/hooks/useContainerObjects';
import { usePaginatedObjects } from '@/api/hooks/useContainer';
import UseStandardInfrequentAccessAvailability from '@/hooks/useStandardInfrequentAccessAvailability';
import { useSortedObjects } from './useSortedObjectsWithIndex';
import { ContainerDatagrid } from './ContainerDataGrid';
import {
  CommonContainerContext,
  S3ContainerContext,
  SwiftContainerContext,
} from './ContainerContext';
import { getDashboardTabs } from '@/utils/getDashboardTabs';
import { useDatagridColumn } from './useDatagridColumn';
import './style.scss';

const trackAction = (actionType, specificAction) => {
  const additionalActions =
    actionType === 'page'
      ? ['page', 'button', specificAction]
      : ['funnel', 'tile-tutorial', specificAction];

  return {
    actions: [UNIVERSE, SUB_UNIVERSE, APP_NAME, ...additionalActions],
  };
};

export default function ObjectPage() {
  const { t } = useTranslation([
    'objects',
    'container',
    'pci-common',
    'dashboard',
  ]);
  const { storageId, projectId } = useParams();
  const [searchParams] = useSearchParams();
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const { clearNotifications } = useNotifications();

  const [search, setSearch] = useState('');
  const [prefix, setPrefix] = useState(null);
  const [searchField, setSearchField] = useState('');
  const [enableVersionsToggle, setEnableVersionsToggle] = useState(false);
  const [sortingDatagrid, setSortingDatagrid] = useState(null);

  const { me } = useMe();
  const { data: project } = useProject();
  const hrefProject = useProjectUrl('public-cloud');
  const objectStorageHref = useHref('..');
  const regionParam = searchParams.get('region');

  const {
    container,
    url,
    region,
    isPending,
    isLocalZone,
    isRightOffer,
  } = useContainerData();

  const { hasMaintenance, maintenanceURL } = useProductMaintenance(
    project?.project_id,
  );

  const {
    data: containerObjects,
    isLoading: isObjectsLoading,
    refetch: refetchContainerObjects,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useServerContainerObjects({
    projectId: project?.project_id,
    region: regionParam,
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
    regionParam,
    enableVersionsToggle,
    container?.s3StorageType,
    searchParams.get('refetch'),
    refetchContainerObjects,
  ]);

  useEffect(() => {
    clearNotifications();
  }, [clearNotifications]);

  const containerObjectsWithIndex = useSortedObjects(
    containerObjects,
    sortingDatagrid,
    container?.s3StorageType,
  );

  const columns = useDatagridColumn({ container, isLocalZone });
  const objectsColumns = useDatagridColumn({
    container,
    isLocalZone,
    shouldSeeVersions: true,
    enableVersionsToggle,
    shouldSeeSearch: true,
  });

  const shouldHideButton = useMemo(() => !container?.tags?.[BACKUP_KEY], [
    container,
  ]);
  const hasStandardInfrequentAccess = UseStandardInfrequentAccessAvailability();

  const REPLICATION_LINK =
    STORAGE_ASYNC_REPLICATION_LINK[me?.ovhSubsidiary] ||
    STORAGE_ASYNC_REPLICATION_LINK.DEFAULT;

  const filterColumns = useMemo(
    () => [
      {
        id: 'name',
        label: t(
          'container:pci_projects_project_storages_containers_container_name_label',
        ),
        comparators: FilterCategories.String,
      },
      {
        id: 'lastModified',
        label: t(
          'container:pci_projects_project_storages_containers_container_lastModified_label',
        ),
        comparators: FilterCategories.Date,
      },
      {
        id: 'storageClass',
        label: t(
          'container:pci_projects_project_storages_containers_container_storage_class_label',
        ),
        comparators: FilterCategories.String,
      },
    ],
    [t],
  );

  const { filters, addFilter, removeFilter } = useColumnFilters();
  const { pagination, setPagination, sorting, setSorting } = useDataGrid();

  const { paginatedObjects } = usePaginatedObjects(
    project?.project_id,
    regionParam,
    container?.name,
    container?.id,
    pagination,
    sorting,
    filters,
  );

  const handleSearch = useCallback(() => {
    setPagination({ pageIndex: 0, pageSize: pagination.pageSize });
    addFilter({
      key: 'search',
      value: searchField,
      comparator: FilterComparator.Includes,
      label: '',
    });
    setSearchField('');
  }, [addFilter, pagination.pageSize, searchField, setPagination]);

  const handleAddObjectClick = useCallback(() => {
    clearNotifications();
    navigate(`./new?region=${regionParam}`);
  }, [clearNotifications, navigate, regionParam]);

  const handleFetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handlePrefixChange = useCallback((newPrefix) => {
    setPrefix(newPrefix);
  }, []);

  const setSearchWithPrefixReset = useCallback((newSearch) => {
    setSearch(newSearch);
    if (newSearch === '') {
      setPrefix(null);
    }
  }, []);

  const tabs = getDashboardTabs({
    projectId,
    storageId,
    region: region?.name,
    t,
  });

  if (!container || !url) return <OdsSpinner size="md" />;

  const commonContextValue = {
    isS3StorageType: isRightOffer,
    isRightOffer,
    isLocalZone,
    versioningStatus: container.versioning?.status,
    shouldHideButton,
    hasStandardInfrequentAccess,
    handleAddObjectClick,
    trackClick,
    trackAction,
  };

  const s3ContextValue = {
    ...commonContextValue,
    enableVersionsToggle,
    sortingDatagrid,
    hasNextPage,
    isObjectsLoading,
    containerObjectsWithIndex,
    containerObjects,
    search,
    setEnableVersionsToggle,
    setSortingDatagrid,
    setSearch: setSearchWithPrefixReset,
    handleFetchNextPage,
    handlePrefixChange,
    objectsColumns,
  };

  const swiftContextValue = {
    ...commonContextValue,
    searchField,
    filters,
    isPending,
    columns,
    paginatedObjects,
    pagination,
    sorting,
    setSearchField,
    setPagination,
    setSorting,
    handleSearch,
    removeFilter,
    addFilter,
    filterColumns,
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
          <OdsBreadcrumbItem href="" label={container?.name} />
        </OdsBreadcrumb>
      }
      header={{
        title: container.name,
        headerButton: (
          <span
            onClick={() => trackClick(trackAction('funnel', 'go-to-tutorial'))}
          >
            <PciGuidesHeader category="objectStorage" />
          </span>
        ),
      }}
      backLinkLabel={`${t('pci-common:common_back_button_back_to')} ${t(
        'container:pci_projects_project_storages_containers_container_back_button_label',
      )}`}
      hrefPrevious={objectStorageHref}
    >
      <Notifications />
      {<TabsPanel tabs={tabs} />}

      {hasMaintenance && (
        <PciMaintenanceBanner maintenanceURL={maintenanceURL} />
      )}

      <CommonContainerContext.Provider value={commonContextValue}>
        {isRightOffer ? (
          <S3ContainerContext.Provider value={s3ContextValue}>
            <ContainerDatagrid />
          </S3ContainerContext.Provider>
        ) : (
          <SwiftContainerContext.Provider value={swiftContextValue}>
            <ContainerDatagrid />
          </SwiftContainerContext.Provider>
        )}
      </CommonContainerContext.Provider>

      <Suspense fallback={<OdsSpinner size="md" />}>
        <Outlet />
      </Suspense>
    </BaseLayout>
  );
}
