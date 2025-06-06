import { Suspense, useRef, useState } from 'react';
import { Outlet, useParams, useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ChangelogButton,
  Datagrid,
  FilterAdd,
  FilterList,
  Headers,
  Notifications,
  PciGuidesHeader,
  useColumnFilters,
  useDataGrid,
  useNotifications,
  useProjectUrl,
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
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import { PciAnnouncementBanner, useProject } from '@ovh-ux/manager-pci-common';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useDatagridColumn } from '@/hooks/useDatagridColumn';
import { useAllVolumes, useVolumes } from '@/api/hooks/useVolume';

import { CHANGELOG_CHAPTERS } from '@/tracking.constants';
import { CHANGELOG_LINKS } from '@/constants';

export default function ListingPage() {
  const { t } = useTranslation(['common', NAMESPACES.ACTIONS]);
  const projectUrl = useProjectUrl('public-cloud');

  const navigate = useNavigate();
  const { projectId } = useParams();
  const columns = useDatagridColumn(projectId, projectUrl);
  const [searchField, setSearchField] = useState('');
  const { data: project } = useProject();
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const { clearNotifications } = useNotifications();
  const filterPopoverRef = useRef(undefined);

  const { pagination, setPagination, sorting, setSorting } = useDataGrid();

  const { data: allVolumes } = useAllVolumes(projectId);
  const { data: volumes, error, isFetching, isPending, refetch } = useVolumes(
    projectId,
    {
      pagination,
      sorting,
    },
    filters,
  );

  if (allVolumes && !allVolumes.length && !isFetching)
    return <Navigate to="./onboarding" />;

  return (
    <div>
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
          changelogButton={
            <ChangelogButton
              links={CHANGELOG_LINKS}
              chapters={CHANGELOG_CHAPTERS}
            />
          }
        />
      </div>
      <OsdsDivider></OsdsDivider>

      <PciAnnouncementBanner />

      <Notifications />

      <div className="sm:flex items-center justify-between mt-4 min-h-[40px]">
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.flat}
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
            className="mr-4 bg-white"
          />
          {t('pci_projects_project_storages_blocks_add_label')}
        </OsdsButton>

        <div className="justify-between flex gap-5 min-h-[40px] items-center">
          <div className="flex items-center">
            {isFetching ? (
              <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
            ) : (
              <OsdsButton
                size={ODS_BUTTON_SIZE.sm}
                color={ODS_THEME_COLOR_INTENT.primary}
                variant={ODS_BUTTON_VARIANT.stroked}
                onClick={() => refetch()}
              >
                <span slot="start" className="flex items-center mr-0">
                  <OsdsIcon
                    name={ODS_ICON_NAME.REFRESH}
                    size={ODS_ICON_SIZE.sm}
                    color={ODS_THEME_COLOR_INTENT.primary}
                  />
                </span>
              </OsdsButton>
            )}
          </div>
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
              <span slot="start" className="flex items-center mr-0">
                <OsdsIcon
                  name={ODS_ICON_NAME.FILTER}
                  size={ODS_ICON_SIZE.sm}
                  color={ODS_THEME_COLOR_INTENT.primary}
                />
                <span>{t('filter', { ns: NAMESPACES.ACTIONS })}</span>
              </span>
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
      {!isPending && !error && (
        <div className="mt-8">
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
    </div>
  );
}
