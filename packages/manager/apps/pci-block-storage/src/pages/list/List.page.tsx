import {
  Datagrid,
  FilterAdd,
  FilterList,
  isDiscoveryProject,
  Notifications,
  PciDiscoveryBanner,
  PciGuidesHeader,
  PciMaintenanceBanner,
  useColumnFilters,
  useDataGrid,
  useProductMaintenance,
  useProject,
} from '@ovhcloud/manager-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  OsdsBreadcrumb,
  OsdsButton,
  OsdsDivider,
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSearchBar,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useContext, useEffect, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Outlet, useParams } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import { FilterCategories, FilterComparator } from '@ovh-ux/manager-core-api';
import { useVolumes } from '@/api/hooks/useVolume';
import { useDatagridColumn } from '@/hooks/useDatagridColumn';

export default function ListingPage() {
  const { t } = useTranslation('common');
  const { t: tFilter } = useTranslation('filter');
  const [projectUrl, setProjectUrl] = useState('');

  const { navigation } = useContext(ShellContext).shell;
  const { projectId } = useParams();
  const { hasMaintenance, maintenanceURL } = useProductMaintenance(projectId);
  const columns = useDatagridColumn(projectId, projectUrl);
  const [searchField, setSearchField] = useState('');
  const { data: project } = useProject(projectId || '');
  const { filters, addFilter, removeFilter } = useColumnFilters();
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
    <>
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
        <div className="flex items-center justify-between">
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            size={ODS_THEME_TYPOGRAPHY_SIZE._600}
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            {t('pci_projects_project_storages_blocks_title')}
          </OsdsText>
          <PciGuidesHeader category="instances"></PciGuidesHeader>
        </div>
      </div>

      <OsdsDivider></OsdsDivider>

      {hasMaintenance && (
        <PciMaintenanceBanner
          maintenanceURL={maintenanceURL}
          productName={t('pci_projects_project_storages_blocks_title')}
        />
      )}
      <Notifications />

      <div className="mb-5">
        {isDiscoveryProject(project) && (
          <PciDiscoveryBanner projectId={projectId} />
        )}
      </div>
      <div className={'sm:flex items-center justify-between mt-4'}>
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
          className="xs:mb-0.5 sm:mb-0"
        >
          <OsdsIcon
            size={ODS_ICON_SIZE.xs}
            name={ODS_ICON_NAME.PLUS}
            className={'mr-2'}
            color={ODS_THEME_COLOR_INTENT.primary}
          />
          {t('pci_projects_project_storages_blocks_add_label')}
        </OsdsButton>
        <div className="justify-between flex">
          <OsdsSearchBar
            className={'w-[70%]'}
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
                className={'mr-2'}
                color={ODS_THEME_COLOR_INTENT.primary}
              />
              {tFilter('common_criteria_adder_filter_label')}
            </OsdsButton>
            <OsdsPopoverContent>
              <FilterAdd
                columns={[
                  {
                    id: 'name',
                    label: t('pci_projects_project_storages_blocks_name_label'),
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
                    label: t('pci_projects_project_storages_blocks_size_label'),
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
          <OsdsSpinner inline={true} size={ODS_SPINNER_SIZE.md} />
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
            className={'overflow-x-visible'}
            sorting={sorting}
            onSortChange={setSorting}
          />
        </div>
      )}
      <Outlet />
    </>
  );
}
