import { useProject } from '@ovh-ux/manager-pci-common';
import {
  Datagrid,
  FilterAdd,
  FilterList,
  Headers,
  Notifications,
  RedirectionGuard,
  useColumnFilters,
  useDataGrid,
  useNotifications,
  useProjectUrl,
  DatagridColumn,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import { Suspense, useMemo, useRef } from 'react';
import {
  OsdsBreadcrumb,
  OsdsButton,
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { FilterCategories } from '@ovh-ux/manager-core-api';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { TLoadBalancer } from '@/api/data/load-balancer';
import OperatingStatusComponent from '@/components/listing/OperatingStatus.component';
import ProvisioningStatusComponent from '@/components/listing/ProvisioningStatus.component';
import ActionsComponent from '@/components/listing/Actions.component';
import CreationDate from '@/components/listing/CreationDate.component';
import DataGridLinkCell from '@/components/datagrid/DataGridLinkCell.component';
import { useLoadBalancers } from '@/api/hook/useLoadBalancer';

export default function ListingPage() {
  const { t } = useTranslation(['load-balancer', 'filter']);

  const { projectId } = useParams();
  const { data: project } = useProject();
  const hrefProject = useProjectUrl('public-cloud');
  const { pagination, setPagination, sorting, setSorting } = useDataGrid();

  const navigate = useNavigate();
  const { clearNotifications } = useNotifications();
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const filterPopoverRef = useRef(undefined);

  const {
    paginatedLoadBalancer,
    allLoadBalancer,
    isPending,
  } = useLoadBalancers(projectId, pagination, sorting, filters);

  const columns: DatagridColumn<TLoadBalancer>[] = useMemo(
    () => [
      {
        id: 'name',
        cell: ({ id, region, name }: TLoadBalancer) => (
          <DataGridLinkCell href={`../${region}/${id}`}>
            {name}
          </DataGridLinkCell>
        ),
        label: t('octavia_load_balancer_name'),
      },
      {
        id: 'region',
        cell: (props: TLoadBalancer) => (
          <DataGridTextCell>{props.region}</DataGridTextCell>
        ),
        label: t('octavia_load_balancer_region'),
      },
      {
        id: 'vipAddress',
        cell: (props: TLoadBalancer) => (
          <DataGridTextCell>{props.vipAddress}</DataGridTextCell>
        ),
        label: t('octavia_load_balancer_ip'),
      },
      {
        id: 'createdAt',
        cell: (props: TLoadBalancer) => <CreationDate date={props.createdAt} />,
        label: t('octavia_load_balancer_creation_date'),
      },
      {
        id: 'provisioningStatus',
        cell: (props: TLoadBalancer) => (
          <ProvisioningStatusComponent
            status={props.provisioningStatus}
            className="w-fit"
          />
        ),
        label: t('octavia_load_balancer_provisioning_status'),
      },
      {
        id: 'operatingStatus',
        cell: (props: TLoadBalancer) => (
          <OperatingStatusComponent
            status={props.operatingStatus}
            className="w-fit"
          />
        ),
        label: t('octavia_load_balancer_operating_status'),
      },
      {
        id: 'actions',
        cell: (props: TLoadBalancer) => (
          <div className="min-w-16">
            <ActionsComponent loadBalancer={props} />
          </div>
        ),
        label: '',
        isSortable: false,
      },
    ],
    [t],
  );

  return (
    <RedirectionGuard
      isLoading={isPending}
      condition={!isPending && allLoadBalancer?.length === 0}
      route="../onboarding"
    >
      <OsdsBreadcrumb
        items={[
          {
            href: hrefProject,
            label: project.description,
          },
          {
            label: t('octavia_load_balancers'),
          },
        ]}
      />

      <div className="header mt-8">
        <Headers title={t('octavia_load_balancers')} />
      </div>

      <Notifications />

      <div className="sm:flex items-center justify-between mt-4">
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.flat}
          color={ODS_THEME_COLOR_INTENT.primary}
          className="xs:mb-0.5 sm:mb-0"
          onClick={() => {
            clearNotifications();
            navigate('../create');
          }}
        >
          <OsdsIcon
            size={ODS_ICON_SIZE.xs}
            name={ODS_ICON_NAME.PLUS}
            className="mr-2 bg-white"
            color={ODS_THEME_COLOR_INTENT.primary}
          />
          {t('octavia_load_balancers_add_button')}
        </OsdsButton>

        <div className="justify-between flex">
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
              {t('filter:common_criteria_adder_filter_label')}
            </OsdsButton>
            <OsdsPopoverContent>
              <FilterAdd
                columns={[
                  {
                    id: 'name',
                    label: t('octavia_load_balancer_name'),
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

      {isPending ? (
        <OsdsSpinner
          inline
          size={ODS_SPINNER_SIZE.md}
          data-testid="List-spinner"
        />
      ) : (
        <Datagrid
          columns={columns}
          items={paginatedLoadBalancer?.rows || []}
          totalItems={paginatedLoadBalancer?.totalRows || 0}
          pagination={pagination}
          onPaginationChange={setPagination}
          sorting={sorting}
          onSortChange={setSorting}
          className="overflow-x-visible"
        />
      )}
      <Suspense>
        <Outlet />
      </Suspense>
    </RedirectionGuard>
  );
}
