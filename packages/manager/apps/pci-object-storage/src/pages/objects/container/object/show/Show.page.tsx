import { Suspense, useMemo, useRef, useState } from 'react';
import {
  Outlet,
  useHref,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import {
  OsdsBreadcrumb,
  OsdsButton,
  OsdsChip,
  OsdsFormField,
  OsdsIcon,
  OsdsLink,
  OsdsMessage,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSearchBar,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  Clipboard,
  Datagrid,
  FilterAdd,
  FilterList,
  Headers,
  useColumnFilters,
  useDataGrid,
  useMe,
  useNotifications,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useBytes, useProject } from '@ovh-ux/manager-pci-common';
import { useTracking } from '@ovh-ux/manager-react-shell-client';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
  OdsHTMLAnchorElementTarget,
} from '@ovhcloud/ods-components';
import { FilterCategories } from '@ovh-ux/manager-core-api';
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

  const { me } = useMe();

  const { formatBytes } = useBytes();

  const hrefProject = useProjectUrl('public-cloud');
  const { t: tObjects } = useTranslation('objects');
  const { t: tContainer } = useTranslation('container');
  const { t: tCommon } = useTranslation('pci-common');
  const { t: tVersioning } = useTranslation('containers/enable-versioning');
  const { t: tAdd } = useTranslation('storages/add');
  const { t: tDataEncryption } = useTranslation('container/data-encryption');
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

  const [searchQueries, setSearchQueries] = useState<string[]>([]);
  const filterPopoverRef = useRef(undefined);

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

  return (
    <>
      <OsdsBreadcrumb
        items={[
          {
            href: hrefProject,
            label: project.description,
          },
          {
            href: objectStorageHref,
            label: tObjects(
              'pci_projects_project_storages_containers_object_title',
            ),
          },
          {
            label: container?.name,
          },
        ]}
      />
      <div className="flex items-center justify-between mt-8">
        <Headers title={container?.name} />
      </div>
      <div>
        <OsdsIcon
          size={ODS_ICON_SIZE.xxs}
          name={ODS_ICON_NAME.ARROW_LEFT}
          color={ODS_THEME_COLOR_INTENT.primary}
          className="mr-4"
        />
        <OsdsLink
          href={objectStorageHref}
          color={ODS_THEME_COLOR_INTENT.primary}
        >
          {`${tCommon('common_back_button_back_to')}
          "${tContainer(
            'pci_projects_project_storages_containers_container_back_button_label',
          )}"`}
        </OsdsLink>
      </div>
      {/* maintenance banner */}
      <section></section>
      <OsdsMessage type={ODS_MESSAGE_TYPE.info} className="mt-6 p-8">
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {tContainer(
            'pci_projects_project_storages_containers_container_add_replication_rules_info',
          )}{' '}
          <OsdsLink
            href={REPLICATION_LINK}
            color={ODS_THEME_COLOR_INTENT.primary}
            target={'_blank' as OdsHTMLAnchorElementTarget}
          >
            {tAdd(
              'pci_projects_project_storages_containers_add_replication_rules_info_link',
            )}
          </OsdsLink>
          <OsdsIcon
            size={ODS_ICON_SIZE.xxs}
            name={ODS_ICON_NAME.ARROW_RIGHT}
            color={ODS_THEME_COLOR_INTENT.primary}
            className="ml-4"
          />
        </OsdsText>
      </OsdsMessage>
      {container && (
        <>
          <div className="grid grid-cols-12 gap-4 border border-solid border-[#bef1ff] bg-[#f5feff] rounded-md mt-6 py-8 px-12">
            <div className="grid gap-2 col-span-12 md:col-span-4">
              <div>
                <OsdsText
                  level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                  size={ODS_THEME_TYPOGRAPHY_SIZE._100}
                  color={ODS_THEME_COLOR_INTENT.text}
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html: tContainer(
                        'pci_projects_project_storages_containers_container_region',
                        { region: `<strong>${container?.region}</strong>` },
                      ),
                    }}
                  ></span>
                </OsdsText>
              </div>

              {!is.localZone && (
                <div>
                  <OsdsText
                    level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                    size={ODS_THEME_TYPOGRAPHY_SIZE._200}
                    color={ODS_THEME_COLOR_INTENT.text}
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html: tContainer(
                          'pci_projects_project_storages_containers_container_object_info_storedObjects',
                          {
                            count: `<strong>${container?.objectsCount}</strong>`,
                          },
                        ),
                      }}
                    ></span>
                  </OsdsText>
                </div>
              )}

              {!is.localZone && (
                <div>
                  <OsdsText
                    level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                    size={ODS_THEME_TYPOGRAPHY_SIZE._200}
                    color={ODS_THEME_COLOR_INTENT.text}
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html: tContainer(
                          'pci_projects_project_storages_containers_container_info_storedBytes',
                          { bytes: `<strong>${container?.usedSpace}</strong>` },
                        ),
                      }}
                    ></span>
                  </OsdsText>
                </div>
              )}
              {displayEncryptionData && !is.encrypted && !is.localZone && (
                <div>
                  <OsdsText
                    level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                    size={ODS_THEME_TYPOGRAPHY_SIZE._200}
                    color={ODS_THEME_COLOR_INTENT.text}
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html: tContainer(
                          'pci_projects_project_storages_containers_container_info_data_encryption_disabled',
                        ),
                      }}
                    ></span>
                  </OsdsText>
                </div>
              )}
              {displayEncryptionData && is.encrypted && (
                <div>
                  <OsdsText
                    level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                    size={ODS_THEME_TYPOGRAPHY_SIZE._200}
                    color={ODS_THEME_COLOR_INTENT.text}
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html: tContainer(
                          'pci_projects_project_storages_containers_container_info_data_encryption_enabled',
                        ),
                      }}
                    ></span>
                  </OsdsText>
                  <OsdsPopover>
                    <OsdsIcon
                      size={ODS_ICON_SIZE.xs}
                      name={ODS_ICON_NAME.HELP}
                      color={ODS_THEME_COLOR_INTENT.primary}
                      slot="popover-trigger"
                      className="ml-4 cursor-help"
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
                    <OsdsPopoverContent>
                      <OsdsText
                        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                        size={ODS_THEME_TYPOGRAPHY_SIZE._100}
                        color={ODS_THEME_COLOR_INTENT.text}
                      >
                        {tDataEncryption(
                          'pci_projects_project_storages_containers_data_encryption_aes256_tooltip',
                        )}
                      </OsdsText>
                    </OsdsPopoverContent>
                  </OsdsPopover>
                </div>
              )}
              {is.rightOffer && !is.localZone && (
                <div>
                  <OsdsText
                    level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                    size={ODS_THEME_TYPOGRAPHY_SIZE._200}
                    color={ODS_THEME_COLOR_INTENT.text}
                  >
                    {tVersioning(
                      'pci_projects_project_storages_containers_update_versioning_versioning',
                    )}
                  </OsdsText>
                  <OsdsChip
                    inline
                    color={(() => {
                      if (container.versioning.status === 'enabled')
                        return ODS_THEME_COLOR_INTENT.success;
                      if (container.versioning.status === 'disabled')
                        return ODS_THEME_COLOR_INTENT.error;
                      if (container.versioning.status === 'suspended')
                        return ODS_THEME_COLOR_INTENT.warning;
                      return ODS_THEME_COLOR_INTENT.default;
                    })()}
                    className="ml-4"
                  >
                    {tVersioning(
                      `pci_projects_project_storages_containers_update_versioning_${container.versioning.status}_label`,
                    )}
                  </OsdsChip>
                </div>
              )}
              {(is.rightOffer &&
                !is.localZone &&
                container.versioning?.status === 'suspended') ||
                (container.versioning?.status === 'disabled' && (
                  <div>
                    <OsdsLink
                      href={enableVersioningHref}
                      color={ODS_THEME_COLOR_INTENT.primary}
                    >
                      {tVersioning(
                        'pci_projects_project_storages_containers_update_versioning_title',
                      )}
                    </OsdsLink>
                    <OsdsIcon
                      size={ODS_ICON_SIZE.xxs}
                      name={ODS_ICON_NAME.ARROW_RIGHT}
                      color={ODS_THEME_COLOR_INTENT.primary}
                      className="ml-4"
                    />
                  </div>
                ))}
            </div>
            <div className="grid col-span-12 md:col-span-8 gap-4">
              <div>
                <OsdsFormField>
                  <OsdsText
                    level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                    size={ODS_THEME_TYPOGRAPHY_SIZE._200}
                    color={ODS_THEME_COLOR_INTENT.text}
                    slot="label"
                  >
                    {tContainer(
                      'pci_projects_project_storages_containers_container_info_id',
                    )}
                  </OsdsText>
                  <Clipboard value={container?.id || container?.name} />
                </OsdsFormField>
              </div>

              <div>
                <OsdsFormField>
                  <span>
                    <OsdsText
                      level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                      size={ODS_THEME_TYPOGRAPHY_SIZE._200}
                      color={ODS_THEME_COLOR_INTENT.text}
                      slot="label"
                    >
                      {tContainer(
                        'pci_projects_project_storages_containers_container_info_publicUrl',
                      )}
                    </OsdsText>
                    <OsdsPopover>
                      <OsdsIcon
                        size={ODS_ICON_SIZE.xs}
                        name={ODS_ICON_NAME.HELP}
                        color={ODS_THEME_COLOR_INTENT.primary}
                        slot="popover-trigger"
                        className="ml-4 cursor-help"
                      />
                      <OsdsPopoverContent>
                        <OsdsText
                          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
                          color={ODS_THEME_COLOR_INTENT.text}
                        >
                          {tContainer(
                            'pci_projects_project_storages_containers_container_info_publicUrl_help',
                          )}
                        </OsdsText>
                      </OsdsPopoverContent>
                    </OsdsPopover>
                  </span>
                  <Clipboard value={container?.publicUrl} />
                </OsdsFormField>
              </div>

              <div>
                <OsdsFormField>
                  <span>
                    <OsdsText
                      level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                      size={ODS_THEME_TYPOGRAPHY_SIZE._200}
                      color={ODS_THEME_COLOR_INTENT.text}
                      slot="label"
                    >
                      {container.s3StorageType
                        ? OBJECT_CONTAINER_S3_STATIC_URL_INFO
                        : tContainer(
                            'pci_projects_project_storages_containers_container_object_info_staticUrl',
                          )}
                    </OsdsText>
                    <OsdsPopover>
                      <OsdsIcon
                        size={ODS_ICON_SIZE.xs}
                        name={ODS_ICON_NAME.HELP}
                        color={ODS_THEME_COLOR_INTENT.primary}
                        slot="popover-trigger"
                        className="ml-4 cursor-help"
                      />
                      <OsdsPopoverContent>
                        <OsdsText
                          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
                          color={ODS_THEME_COLOR_INTENT.text}
                        >
                          {tContainer(
                            `pci_projects_project_storages_containers_container_object_info_${
                              container.s3StorageType
                                ? 's3_staticUrl_help'
                                : 'staticUrl_help'
                            }`,
                          )}
                        </OsdsText>
                      </OsdsPopoverContent>
                    </OsdsPopover>
                  </span>
                  <Clipboard
                    value={container?.staticUrl || container?.virtualHost}
                  />
                </OsdsFormField>
              </div>
            </div>
          </div>

          <div className="sm:flex items-center justify-between mt-8">
            <OsdsButton
              size={ODS_BUTTON_SIZE.sm}
              variant={ODS_BUTTON_VARIANT.stroked}
              color={ODS_THEME_COLOR_INTENT.primary}
              className="xs:mb-0.5 sm:mb-0"
              onClick={() => {
                clearNotifications();
                navigate(`./new?region=${searchParams.get('region')}`);
              }}
            >
              <OsdsIcon
                size={ODS_ICON_SIZE.xs}
                name={ODS_ICON_NAME.PLUS}
                className="mr-2"
                color={ODS_THEME_COLOR_INTENT.primary}
              />
              {tContainer(
                `pci_projects_project_storages_containers_container_add_object_label`,
              )}
            </OsdsButton>

            <div className="justify-between flex">
              <OsdsSearchBar
                data-testid="search-bar"
                className="w-[14rem]"
                value={searchField}
                onOdsSearchSubmit={({ detail }) => {
                  const { inputValue } = detail;
                  if (inputValue) {
                    setSearchField('');
                    if (searchQueries.indexOf(inputValue) < 0) {
                      setSearchQueries([...searchQueries, inputValue]);
                      setPagination({
                        ...pagination,
                        pageIndex: 0,
                      });
                    } else {
                      setSearchQueries([...searchQueries]);
                    }
                  }
                }}
              />
              <OsdsPopover ref={filterPopoverRef}>
                <OsdsButton
                  slot="popover-trigger"
                  size={ODS_BUTTON_SIZE.sm}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  variant={ODS_BUTTON_VARIANT.stroked}
                  class="ml-4"
                >
                  <OsdsIcon
                    name={ODS_ICON_NAME.FILTER}
                    size={ODS_ICON_SIZE.xs}
                    className="ml-2"
                    color={ODS_THEME_COLOR_INTENT.primary}
                  />
                  {tFilter('common_criteria_adder_filter_label')}
                </OsdsButton>
                <OsdsPopoverContent>
                  <FilterAdd
                    columns={[
                      {
                        id: 'key',
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
                      {
                        id: 'storageClass',
                        label: tContainer(
                          'pci_projects_project_storages_containers_container_storage_class_label',
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
                      filterPopoverRef.current?.closeSurface();
                    }}
                  />
                </OsdsPopoverContent>
              </OsdsPopover>
            </div>
          </div>
          <div className="my-8">
            <FilterList filters={filters} onRemoveFilter={removeFilter} />
          </div>
          {isPending ? (
            <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
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
          <Tiles />
        </>
      )}
      <Suspense>
        <Outlet />
      </Suspense>
    </>
  );
}
