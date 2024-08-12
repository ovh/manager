import { FilterComparator } from '@ovh-ux/manager-core-api';
import { useProject } from '@ovh-ux/manager-pci-common';
import {
  Datagrid,
  FilterList,
  Headers,
  Notifications,
  PciGuidesHeader,
  useColumnFilters,
  useDataGrid,
  useNotifications,
  useProjectUrl,
} from '@ovhcloud/manager-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsBreadcrumb,
  OsdsButton,
  OsdsIcon,
  OsdsSearchBar,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import queryClient from '@/queryClient';
import {
  getRegistryQueryPrefix,
  useAllRegistries,
} from '@/api/hooks/useRegistry';
import { useDatagridColumn } from './useDatagridColumn';

export default function ListPage() {
  const { t } = useTranslation();

  const { projectId } = useParams();
  const { data: project } = useProject();
  const hrefProject = useProjectUrl('public-cloud');
  const { pagination, setPagination, sorting, setSorting } = useDataGrid();
  const columns = useDatagridColumn();
  const navigate = useNavigate();
  const { clearNotifications } = useNotifications();
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const [searchField, setSearchField] = useState('');

  const { data, isPending } = useAllRegistries(
    projectId,
    pagination,
    filters,
    sorting,
  );

  const refreshRegistries = () => {
    queryClient.invalidateQueries({
      queryKey: getRegistryQueryPrefix(projectId),
    });
  };

  return (
    <>
      {project && (
        <OsdsBreadcrumb
          items={[
            {
              href: hrefProject,
              label: project.description,
            },
            {
              label: t('private_registry_title'),
            },
          ]}
        />
      )}

      <div className="header mt-8">
        <Headers
          title={t('private_registry_title')}
          headerButton={<PciGuidesHeader category="private_registry" />}
        />
      </div>

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
          {t('private_registry_create_registry')}
        </OsdsButton>

        <div className="justify-between flex">
          <div className="min-w-14 mr-4">
            <OsdsButton
              size={ODS_BUTTON_SIZE.sm}
              variant={ODS_BUTTON_VARIANT.stroked}
              color={ODS_THEME_COLOR_INTENT.primary}
              onClick={() => refreshRegistries()}
            >
              <OsdsIcon
                color={ODS_THEME_COLOR_INTENT.primary}
                name={ODS_ICON_NAME.REFRESH}
                size={ODS_ICON_SIZE.sm}
              />
            </OsdsButton>
          </div>
          <OsdsSearchBar
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
        </div>
      </div>

      <div className="my-5">
        <FilterList filters={filters} onRemoveFilter={removeFilter} />
      </div>

      {isPending ? (
        <div className="text-center">
          <OsdsSpinner
            inline
            size={ODS_SPINNER_SIZE.md}
            data-testid="List-spinner"
          />
        </div>
      ) : (
        <div>
          <Datagrid
            columns={columns}
            items={data?.rows || []}
            totalItems={data?.totalRows || 0}
            pagination={pagination}
            onPaginationChange={setPagination}
            sorting={sorting}
            onSortChange={setSorting}
            className="overflow-x-visible"
          />
        </div>
      )}
      <Suspense>
        <Outlet />
      </Suspense>
    </>
  );
}
