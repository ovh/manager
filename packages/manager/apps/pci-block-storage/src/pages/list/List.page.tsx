import { Suspense, useContext, useEffect, useRef, useState } from 'react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Datagrid,
  FilterAdd,
  FilterList,
  Headers,
  Notifications,
  PciGuidesHeader,
  PciMaintenanceBanner,
  RedirectionGuard,
  useColumnFilters,
  useDataGrid,
  useNotifications,
  useProductMaintenance,
} from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OsdsBreadcrumb,
  OsdsButton,
  OsdsDivider,
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSearchBar,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import { FilterCategories, FilterComparator } from '@ovh-ux/manager-core-api';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import { PciAnnouncementBanner, useProject } from '@ovh-ux/manager-pci-common';
import { useDatagridColumn } from '@/hooks/useDatagridColumn';

import HidePreloader from '@/core/HidePreloader';
import { useAllVolumes, useVolumes } from '@/api/hooks/useVolume';

export default function ListingPage() {
  const { t } = useTranslation('common');
  const { t: tFilter } = useTranslation('filter');
  const [projectUrl, setProjectUrl] = useState('');

  const { navigation } = useContext(ShellContext).shell;
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { hasMaintenance, maintenanceURL } = useProductMaintenance(projectId);
  const columns = useDatagridColumn(projectId, projectUrl);
  const [searchField, setSearchField] = useState('');
  const { data: project } = useProject();
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const { clearNotifications } = useNotifications();
  const filterPopoverRef = useRef(undefined);

  const { pagination, setPagination, sorting, setSorting } = useDataGrid();

  useEffect(() => {
    navigation
      .getURL('public-cloud', `#/pci/projects/${projectId}`, {})
      .then((data) => {
        setProjectUrl(data as string);
      });
  }, [projectId, navigation]);

  const {
    data: allVolumes,
    isFetching: isFetchingllVolumes,
    isPending: isPendingAllVolumes,
  } = useAllVolumes(projectId);
  const {
    data: volumes,
    isLoading: isVolumesLoading,
    isPending: isVolumesPending,
    error,
  } = useVolumes(
    projectId,
    {
      pagination,
      sorting,
    },
    filters,
  );

  const isLoading = isVolumesLoading || isVolumesPending;

  return (
    <RedirectionGuard
      isLoading={isFetchingllVolumes || isPendingAllVolumes}
      route={`/pci/projects/${projectId}/storages/blocks/onboarding`}
      condition={allVolumes?.length === 0}
    >
      <>
        <HidePreloader />
        {project && (
          <OsdsBreadcrumb
            items={[
              {
                href: projectUrl,
                label: project.description,
              },
              {
                label: t('pci_projects_project_storages_blocks_title'),
              },
            ]}
          />
        )}
        <div className="header mb-6 mt-8">
          <Headers
            title={t('pci_projects_project_storages_blocks_title')}
            headerButton={<PciGuidesHeader category="instances" />}
          />
        </div>
        <OsdsDivider></OsdsDivider>

        {hasMaintenance && (
          <PciMaintenanceBanner
            maintenanceURL={maintenanceURL}
            data-testid="ListPage_maintenance-banner"
            productName={t('pci_projects_project_storages_blocks_title')}
          />
        )}

        <PciAnnouncementBanner data-testid="ListPage_announcementBanner" />

        <Notifications />
        <div className="sm:flex items-center justify-between mt-4">
          <OsdsButton
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.stroked}
            color={ODS_THEME_COLOR_INTENT.primary}
            className="xs:mb-0.5 sm:mb-0"
            onClick={() => {
              clearNotifications();
              navigate('./new');
            }}
          >
            <OsdsIcon
              size={ODS_ICON_SIZE.xs}
              name={ODS_ICON_NAME.PLUS}
              className="mr-2"
              color={ODS_THEME_COLOR_INTENT.primary}
            />
            {t('pci_projects_project_storages_blocks_add_label')}
          </OsdsButton>
          <div className="justify-between flex">
            <OsdsSearchBar
              className="w-[70%]"
              value={searchField}
              onOdsSearchSubmit={({ detail }) => {
                setPagination({
                  pageIndex: 0,
                  pageSize: pagination.pageSize,
                });
                addFilter({
                  key: 'name',
                  value: detail.inputValue,
                  comparator: FilterComparator.Includes,
                  label: '',
                });
                setSearchField('');
              }}
            />
            <OsdsPopover ref={filterPopoverRef}>
              <OsdsButton
                slot="popover-trigger"
                size={ODS_BUTTON_SIZE.sm}
                color={ODS_THEME_COLOR_INTENT.primary}
                variant={ODS_BUTTON_VARIANT.stroked}
              >
                <OsdsIcon
                  name={ODS_ICON_NAME.FILTER}
                  size={ODS_ICON_SIZE.xs}
                  className="mr-2"
                  color={ODS_THEME_COLOR_INTENT.primary}
                />
                {tFilter('common_criteria_adder_filter_label')}
              </OsdsButton>
              <OsdsPopoverContent>
                <FilterAdd
                  columns={[
                    {
                      id: 'name',
                      label: t(
                        'pci_projects_project_storages_blocks_name_label',
                      ),
                      comparators: FilterCategories.String,
                    },
                    {
                      id: 'id',
                      label: t('pci_projects_project_storages_blocks_id_label'),
                      comparators: FilterCategories.String,
                    },
                    {
                      id: 'regionName',
                      label: t(
                        'pci_projects_project_storages_blocks_region_label',
                      ),
                      comparators: FilterCategories.String,
                    },
                    {
                      id: 'size',
                      label: t(
                        'pci_projects_project_storages_blocks_size_label',
                      ),
                      comparators: FilterCategories.Numeric,
                    },
                    {
                      id: 'status',
                      label: t(
                        'pci_projects_project_storages_blocks_status_label',
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
        <div className="my-5">
          <FilterList filters={filters} onRemoveFilter={removeFilter} />
        </div>
        {isLoading && (
          <div className="text-center">
            <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
          </div>
        )}
        {!isLoading && !error && (
          <div>
            <Datagrid
              columns={columns}
              items={volumes?.rows || []}
              totalItems={volumes?.totalRows || 0}
              pagination={pagination}
              onPaginationChange={setPagination}
              className="overflow-x-visible"
              sorting={sorting}
              onSortChange={setSorting}
            />
          </div>
        )}
        <Suspense>
          <Outlet />
        </Suspense>
      </>
    </RedirectionGuard>
  );
}
