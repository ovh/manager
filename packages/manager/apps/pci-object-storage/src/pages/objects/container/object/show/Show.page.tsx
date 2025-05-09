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
  Clipboard,
  Datagrid,
  FilterAdd,
  FilterList,
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
import { ShellContext, useTracking } from '@ovh-ux/manager-react-shell-client';
import { FilterCategories, FilterComparator } from '@ovh-ux/manager-core-api';
import {
  OdsBadge,
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsButton,
  OdsFormField,
  OdsIcon,
  OdsInput,
  OdsMessage,
  OdsPopover,
  OdsSpinner,
  OdsText,
  OdsToggle,
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
  OBJECT_CONTAINER_S3_STATIC_URL_INFO,
  STORAGE_ASYNC_REPLICATION_LINK,
  TRACKING,
  MUMBAI_REGION_NAME,
  STATUS_ENABLED,
  STATUS_DISABLED,
  STATUS_SUSPENDED,
} from '@/constants';
import { useGetRegion } from '@/api/hooks/useRegion';
import { useStorage, useStorageEndpoint } from '@/api/hooks/useStorages';
import { TServerContainer } from '@/api/data/container';
import { useGetEncriptionAvailability } from '@/api/hooks/useGetEncriptionAvailability';
import LabelComponent from '@/components/Label.component';
import { TRegion } from '@/api/data/region';

import { useServerContainerObjects } from '@/api/hooks/useContainerObjects';

import './style.scss';
import { useSortedObjects } from './useSortedObjectsWithIndex';

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

export default function ObjectPage() {
  const { storageId } = useParams();
  const [searchParams] = useSearchParams();
  const { data: project } = useProject();

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
  const { t: tVersioning } = useTranslation('containers/enable-versioning');
  const { t: tAdd } = useTranslation('containers/add');
  const { t: tDataEncryption } = useTranslation('containers/data-encryption');

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

  const { t: tFilter } = useTranslation('filters');

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
            label={tObjects(
              'pci_projects_project_storages_containers_object_title',
            )}
          />
          <OdsBreadcrumbItem href="" label={container?.name} />
        </OdsBreadcrumb>
      }
      header={{
        title: container.name,
        headerButton: <PciGuidesHeader category="objectStorage" />,
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
          <div className="grid grid-cols-12 gap-4 border border-solid border-[#bef1ff] bg-[#f5feff] rounded-md mt-6 py-8 px-12">
            <div className="grid gap-2 col-span-12 md:col-span-4">
              <div className="mb-4">
                <OdsText>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: tContainer(
                        'pci_projects_project_storages_containers_container_region',
                        { region: `<strong> ${container?.region}</strong>` },
                      ),
                    }}
                  ></span>
                </OdsText>
              </div>

              {!is.localZone && (
                <div className="mb-4">
                  <OdsText>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: tContainer(
                          'pci_projects_project_storages_containers_container_object_info_storedObjects',
                          {
                            objects: `<strong>${container?.objectsCount}</strong>`,
                          },
                        ),
                      }}
                    ></span>
                  </OdsText>
                </div>
              )}

              {!is.localZone && (
                <div className="mb-4">
                  <OdsText>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: tContainer(
                          'pci_projects_project_storages_containers_container_info_storedBytes',
                          {
                            bytes: `<strong>${container?.usedSpace}</strong>`,
                          },
                        ),
                      }}
                    ></span>
                  </OdsText>
                </div>
              )}

              {displayEncryptionData && !is.encrypted && !is.localZone && (
                <div className="mb-4">
                  <OdsText>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: tContainer(
                          'pci_projects_project_storages_containers_container_info_data_encryption_disabled',
                        ),
                      }}
                    ></span>
                  </OdsText>

                  {is.rightOffer &&
                    !is.localZone &&
                    !is.encrypted &&
                    region?.name !== MUMBAI_REGION_NAME && (
                      <div>
                        <Links
                          label={tContainer(
                            'pci_projects_project_storages_containers_container_enable_encryption',
                          )}
                          type={LinkType.next}
                          href={enableEncryptionHref}
                        />
                      </div>
                    )}
                </div>
              )}

              {displayEncryptionData && is.encrypted && (
                <div className="mb-4">
                  <OdsText>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: tContainer(
                          'pci_projects_project_storages_containers_container_info_data_encryption_enabled',
                        ),
                      }}
                    ></span>
                  </OdsText>
                  <OdsIcon
                    id="aesPopoverTrigger"
                    name="circle-question"
                    className="ml-4"
                    onClick={() => {
                      const name = TRACKING.STORAGE_ENCRYPTION.TOOLTIP_AES256;
                      if (name) {
                        tracking?.trackClick({
                          name,
                          type: 'action',
                        });
                      }
                    }}
                  />
                  <OdsPopover triggerId="aesPopoverTrigger">
                    <OdsText>
                      {tDataEncryption(
                        'pci_projects_project_storages_containers_data_encryption_aes256_tooltip',
                      )}
                    </OdsText>
                  </OdsPopover>
                </div>
              )}
              {is.rightOffer && !is.localZone && (
                <div className="flex gap-4">
                  <OdsText>
                    {tVersioning(
                      'pci_projects_project_storages_containers_update_versioning_versioning',
                    )}
                  </OdsText>
                  <OdsBadge
                    size="sm"
                    label={tVersioning(
                      `pci_projects_project_storages_containers_update_versioning_${container.versioning.status}_label`,
                    )}
                    color={(() => {
                      if (container.versioning.status === STATUS_ENABLED)
                        return 'success';
                      if (container.versioning.status === STATUS_DISABLED)
                        return 'critical';
                      if (container.versioning.status === STATUS_SUSPENDED)
                        return 'warning';
                      return 'information';
                    })()}
                  ></OdsBadge>
                </div>
              )}
              {is.rightOffer &&
                !is.localZone &&
                (container.versioning?.status === STATUS_SUSPENDED ||
                  container.versioning?.status === STATUS_DISABLED) && (
                  <Links
                    label={tVersioning(
                      'pci_projects_project_storages_containers_update_versioning_title',
                    )}
                    type={LinkType.next}
                    href={enableVersioningHref}
                  />
                )}

              {is.rightOffer &&
                !is.localZone &&
                container.regionDetails?.type ===
                  OBJECT_CONTAINER_MODE_MULTI_ZONES && (
                  <div className="flex gap-4 mb-4 mt-4">
                    <OdsText>
                      {tContainer(
                        'pci_projects_project_storages_containers_container_offsite_replication_title',
                      )}
                    </OdsText>

                    <OdsBadge
                      size="sm"
                      label={tContainer(
                        is.replicationRulesBannerShown
                          ? 'pci_projects_project_storages_containers_container_offsite_replication_disabled'
                          : 'pci_projects_project_storages_containers_container_offsite_replication_enabled',
                      )}
                      color={
                        !is.replicationRulesBannerShown ? 'success' : 'critical'
                      }
                    ></OdsBadge>
                    <div>
                      <OdsIcon
                        id="trigger-popover"
                        name="circle-question"
                        className="text-[var(--ods-color-information-500)]"
                      />
                      <OdsPopover triggerId="trigger-popover">
                        <OdsText preset="caption">
                          {tContainer(
                            'pci_projects_project_storages_containers_container_offsite_replication_tooltip',
                          )}
                        </OdsText>
                      </OdsPopover>
                    </div>
                  </div>
                )}
            </div>
            <div className="grid col-span-12 md:col-span-8 gap-4">
              <OdsFormField>
                <LabelComponent
                  text={tContainer(
                    'pci_projects_project_storages_containers_container_info_id',
                  )}
                />
                <Clipboard
                  className="w-[100%]"
                  value={container?.id || container?.name}
                />
              </OdsFormField>

              <OdsFormField>
                <LabelComponent
                  triggerId="public-url-popover"
                  text={tContainer(
                    'pci_projects_project_storages_containers_container_info_publicUrl',
                  )}
                  helpText={tContainer(
                    'pci_projects_project_storages_containers_container_info_publicUrl_help',
                  )}
                />
                <Clipboard className="w-[100%]" value={container?.publicUrl} />
              </OdsFormField>

              <OdsFormField>
                <LabelComponent
                  triggerId="virtual-host-popover"
                  text={
                    container.s3StorageType
                      ? OBJECT_CONTAINER_S3_STATIC_URL_INFO
                      : tContainer(
                          'pci_projects_project_storages_containers_container_object_info_staticUrl',
                        )
                  }
                  helpText={tContainer(
                    `pci_projects_project_storages_containers_container_object_info_${
                      container.s3StorageType
                        ? 's3_staticUrl_help'
                        : 'staticUrl_help'
                    }`,
                  )}
                />
                <Clipboard
                  className="w-[100%]"
                  value={container?.staticUrl || container?.virtualHost}
                />
              </OdsFormField>
            </div>
          </div>

          {container?.s3StorageType && (
            <div className="mt-[32px] container-data-grid">
              <OdsText preset="heading-4" className="mt-6 block">
                {tContainer(
                  'pci_projects_project_storages_containers_container_objects',
                )}
              </OdsText>
              <OdsText preset="paragraph" className="mt-4 block mb-6">
                {tContainer(
                  'pci_projects_project_storages_containers_container_objects_sort_warining',
                )}
              </OdsText>
              <Datagrid
                topbar={
                  <div className="flex w-full justify-between items-center">
                    {shouldHideButton && (
                      <OdsButton
                        onClick={() => {
                          clearNotifications();
                          navigate(
                            `./new?region=${searchParams.get('region')}`,
                          );
                        }}
                        label={tContainer(
                          `pci_projects_project_storages_containers_container_add_object_label`,
                        )}
                        icon="plus"
                        size="sm"
                      />
                    )}
                    <div className="flex justify-center gap-4 ml-auto mr-0 md:mr-5">
                      {is.rightOffer &&
                        !is.localZone &&
                        container.versioning.status !== STATUS_DISABLED && (
                          <>
                            <OdsText>
                              {tContainer(
                                'pci_projects_project_storages_containers_container_show_versions',
                              )}
                            </OdsText>
                            <OdsToggle
                              class="my-toggle"
                              name="enableVersionsToggle"
                              onOdsChange={({ detail }) =>
                                setEnableVersionsToggle(detail.value as boolean)
                              }
                            />
                          </>
                        )}
                    </div>
                  </div>
                }
                columns={objectsColumns}
                sorting={sortingDatagrid}
                onSortChange={setSortingDatagrid}
                hasNextPage={hasNextPage}
                items={isObjectsLoading ? [] : containerObjectsWithIndex}
                onFetchNextPage={handleFetchNextPage}
                totalItems={containerObjects?.length}
                isLoading={isObjectsLoading}
                search={{
                  searchInput: search,
                  setSearchInput: setSearch,
                  onSearch: handlePrefixChange,
                }}
              />
            </div>
          )}

          {!container?.s3StorageType && (
            <>
              <div className="sm:flex items-center justify-between mt-8">
                {shouldHideButton && (
                  <OdsButton
                    onClick={() => {
                      clearNotifications();
                      navigate(`./new?region=${searchParams.get('region')}`);
                    }}
                    label={tContainer(
                      `pci_projects_project_storages_containers_container_add_object_label`,
                    )}
                    icon="plus"
                    size="sm"
                  />
                )}

                <div className="flex justify-center gap-4 ml-auto">
                  {!container?.s3StorageType && (
                    <>
                      {' '}
                      <OdsInput
                        name="searchField"
                        className="min-w-[15rem]"
                        value={searchField}
                        onOdsChange={({ detail }) =>
                          setSearchField(detail.value as string)
                        }
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            handleSearch();
                          }
                        }}
                      />
                      <OdsButton
                        label=""
                        icon="magnifying-glass"
                        size="sm"
                        onClick={handleSearch}
                      />
                      <OdsButton
                        id="filterPopoverTrigger"
                        size="sm"
                        color="primary"
                        label={tFilter('common_criteria_adder_filter_label')}
                        variant="outline"
                        icon="filter"
                      />
                      <OdsPopover triggerId="filterPopoverTrigger">
                        <FilterAdd
                          columns={filterColumns}
                          onAddFilter={(addedFilter, column) => {
                            setPagination({
                              pageIndex: 0,
                              pageSize: pagination.pageSize,
                            });
                            addFilter({
                              ...addedFilter,
                              label: column.label,
                            });
                          }}
                        />
                      </OdsPopover>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <FilterList filters={filters} onRemoveFilter={removeFilter} />
              </div>
              <div className="mt-8">
                {isPending ? (
                  <OdsSpinner />
                ) : (
                  <Datagrid
                    columns={columns}
                    items={paginatedObjects?.rows || []}
                    totalItems={paginatedObjects?.totalRows || 0}
                    pagination={pagination}
                    onPaginationChange={setPagination}
                    sorting={sorting}
                    onSortChange={setSorting}
                    className="overflow-x-visible"
                  />
                )}
              </div>
            </>
          )}
        </>
      )}
      <Suspense>
        <Outlet />
      </Suspense>
    </BaseLayout>
  );
}
