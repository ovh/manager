import { Suspense, useMemo, useState } from 'react';
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
import { useTracking } from '@ovh-ux/manager-react-shell-client';
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
} from '@ovhcloud/ods-components/react';
import {
  usePaginatedObjects,
  useServerContainer,
} from '@/api/hooks/useContainer';
import { useDatagridColumn } from './useDatagridColumn';
import { Tiles } from './Tiles';
import {
  NO_ENCRYPTION_VALUE,
  OBJECT_CONTAINER_MODE_LOCAL_ZONE,
  OBJECT_CONTAINER_MODE_MONO_ZONE,
  OBJECT_CONTAINER_MODE_MULTI_ZONES,
  OBJECT_CONTAINER_OFFER_STORAGE_STANDARD,
  OBJECT_CONTAINER_S3_STATIC_URL_INFO,
  STORAGE_ASYNC_REPLICATION_LINK,
  TRACKING,
} from '@/constants';
import { useGetRegion } from '@/api/hooks/useRegion';
import { useAllStorages } from '@/api/hooks/useStorages';
import { TServerContainer } from '@/api/data/container';
import { useGetEncriptionAvailability } from '@/api/hooks/useGetEncriptionAvailability';
import LabelComponent from '@/components/Label.component';

export type TContainer = {
  id: string;
  objectsCount: number;
  usedSpace: string | number;
  publicUrl: string;
  s3StorageType: string;
  staticUrl: string;
} & TServerContainer;

export default function ObjectPage() {
  const { storageId } = useParams();
  const [searchParams] = useSearchParams();
  const { data: project } = useProject();

  const { trackClick } = useTracking();

  const { data: allContainers } = useAllStorages(project?.project_id);
  const { hasMaintenance, maintenanceURL } = useProductMaintenance(
    project.project_id,
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

  const { data: region } = useGetRegion(
    project?.project_id,
    searchParams.get('region'),
  );

  const targetContainer = useMemo(
    () =>
      allContainers?.resources.find(
        (c) => c.id === storageId || c.name === storageId,
      ),
    [allContainers, storageId],
  );

  const { data: serverContainer, isPending } = useServerContainer(
    project?.project_id,
    searchParams.get('region'),
    targetContainer?.name,
    targetContainer?.id,
  );

  const container = useMemo((): TContainer => {
    if (!serverContainer) return undefined;
    return {
      ...serverContainer,
      id: serverContainer?.id || targetContainer?.id,
      name: serverContainer?.name || targetContainer?.name,
      objectsCount:
        serverContainer?.storedObjects || serverContainer?.objectsCount,
      usedSpace: formatBytes(
        serverContainer?.storedBytes || serverContainer?.objectsSize,
        2,
        1000,
      ),
      publicUrl: region?.services.find(
        (service) => service.name === OBJECT_CONTAINER_OFFER_STORAGE_STANDARD,
      )?.endpoint,
      s3StorageType: allContainers?.resources.find(
        (c) => c.id === storageId || c.name === storageId,
      )?.s3StorageType,
      staticUrl: serverContainer?.staticUrl || serverContainer?.virtualHost,
    };
  }, [serverContainer, region, allContainers]);

  const is = {
    localZone: useMemo(
      () =>
        region?.services.find(
          (service) => service.name === OBJECT_CONTAINER_MODE_LOCAL_ZONE,
        ),
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

      return !hasEnabledRule && validTypes.includes(region?.type);
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

  if (!container) {
    return <OdsSpinner size="md" />;
  }

  return (
    <BaseLayout
      breadcrumb={
        <OdsBreadcrumb>
          <OdsBreadcrumbItem href={hrefProject} label={project.description} />
          <OdsBreadcrumbItem
            href={objectStorageHref}
            label={tObjects(
              'pci_projects_project_storages_containers_object_title',
            )}
          />
          <OdsBreadcrumbItem href="" label={project.description} />
        </OdsBreadcrumb>
      }
      header={{ title: container?.name }}
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
        <OdsMessage color="information" className="mt-6">
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
              <div>
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
                <div>
                  <OdsText>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: tContainer(
                          'pci_projects_project_storages_containers_container_object_info_storedObjects',
                          {
                            // count: `<strong>${container?.objectsCount}</strong>`,
                          },
                          // count is a reserved word in i18n(plurals) and should be a number, thus this quick fix since we couldn't change the key in trad files
                        ).replace(
                          '{{ count }}',
                          `<strong>${container?.objectsCount}</strong>`,
                        ),
                      }}
                    ></span>
                  </OdsText>
                </div>
              )}

              {!is.localZone && (
                <div>
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
                <div>
                  <OdsText>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: tContainer(
                          'pci_projects_project_storages_containers_container_info_data_encryption_disabled',
                        ),
                      }}
                    ></span>
                  </OdsText>
                </div>
              )}

              {displayEncryptionData && is.encrypted && (
                <div>
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
                        trackClick({
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
                    size="md"
                    className="font-bold"
                    label={tVersioning(
                      `pci_projects_project_storages_containers_update_versioning_${container.versioning.status}_label`,
                    )}
                    color={(() => {
                      if (container.versioning.status === 'enabled')
                        return 'success';
                      if (container.versioning.status === 'disabled')
                        return 'critical';
                      if (container.versioning.status === 'suspended')
                        return 'warning';
                      return 'information';
                    })()}
                  ></OdsBadge>
                </div>
              )}
              {(is.rightOffer &&
                !is.localZone &&
                container.versioning?.status === 'suspended') ||
                (container.versioning?.status === 'disabled' && (
                  <Links
                    label={tVersioning(
                      'pci_projects_project_storages_containers_update_versioning_title',
                    )}
                    type={LinkType.next}
                    href={enableVersioningHref}
                  />
                ))}
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

          <div className="sm:flex items-center justify-between mt-8">
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

            <div className="flex justify-center gap-4">
              <OdsInput
                name="searchField"
                className="min-w-[15rem]"
                value={searchField}
                onOdsChange={({ detail }) =>
                  setSearchField(detail.value as string)
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
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
                  }
                }}
              />
              <OdsButton
                label=""
                icon="magnifying-glass"
                size="sm"
                onClick={() => {
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
                }}
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
                  columns={[
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
                      comparators: FilterCategories.String,
                    },
                  ]}
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

          <div className="mt-8">
            <Tiles />
          </div>
        </>
      )}
      <Suspense>
        <Outlet />
      </Suspense>
    </BaseLayout>
  );
}
