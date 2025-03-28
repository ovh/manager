import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import {
  Datagrid,
  FilterAdd,
  FilterList,
  Headers,
  useColumnFilters,
  useDataGrid,
  useNotifications,
  DatagridColumn,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import {
  OsdsButton,
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSearchBar,
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
import { FilterCategories, FilterComparator } from '@ovh-ux/manager-core-api';
import { useL7Policies } from '@/api/hook/useL7Policy';
import OperatingStatusComponent from '@/components/listing/OperatingStatus.component';
import ProvisioningStatusComponent from '@/components/listing/ProvisioningStatus.component';
import { TL7Policy } from '@/api/data/l7Policies';
import ActionsComponent from '@/pages/detail/listeners/l7/list/Actions.component';
import DataGridLinkCell from '@/components/datagrid/DataGridLinkCell.component';

export default function L7PoliciesList() {
  const { t } = useTranslation(['l7', 'load-balancer', 'filter']);

  const { projectId, region, listenerId } = useParams();
  const { pagination, setPagination, sorting, setSorting } = useDataGrid();

  const navigate = useNavigate();
  const { clearNotifications } = useNotifications();
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const [searchField, setSearchField] = useState('');
  const filterPopoverRef = useRef(undefined);

  const { paginatedL7Policies, isPending } = useL7Policies(
    projectId,
    listenerId,
    region,
    pagination,
    sorting,
    filters,
  );

  useEffect(() => {
    clearNotifications();
  }, []);

  const columns: DatagridColumn<TL7Policy>[] = useMemo(
    () => [
      {
        id: 'position',
        cell: (props: TL7Policy) => (
          <DataGridTextCell>
            <span className="inline-block align-text-top">
              {props.position}
              <OsdsButton
                className="inline-block align-bottom"
                size={ODS_BUTTON_SIZE.sm}
                color={ODS_THEME_COLOR_INTENT.text}
                variant={ODS_BUTTON_VARIANT.ghost}
                onClick={() => navigate(`../${props.id}/edit`)}
              >
                <OsdsIcon size={ODS_ICON_SIZE.xxs} name={ODS_ICON_NAME.PEN} />
              </OsdsButton>
            </span>
          </DataGridTextCell>
        ),
        label: t('octavia_load_balancer_list_l7_policies_position'),
      },
      {
        id: 'name',
        cell: ({ id, name }: TL7Policy) => (
          <DataGridLinkCell href={`../${id}/edit`}>{name}</DataGridLinkCell>
        ),
        label: t('octavia_load_balancer_list_l7_policies_name'),
      },
      {
        id: 'action',
        cell: (props: TL7Policy) => (
          <DataGridTextCell>{props.action}</DataGridTextCell>
        ),
        label: t('octavia_load_balancer_list_l7_policies_action'),
      },
      {
        id: 'attribute',
        cell: (props: TL7Policy) => (
          <DataGridTextCell>{props.attribute}</DataGridTextCell>
        ),
        label: t('octavia_load_balancer_list_l7_policies_attribute'),
        isSortable: false,
      },
      {
        id: 'redirectHttpCode',
        cell: (props: TL7Policy) => (
          <DataGridTextCell>{props.redirectHttpCode || '-'}</DataGridTextCell>
        ),
        label: t('octavia_load_balancer_list_l7_policies_redirect_code'),
        isSortable: false,
      },
      {
        id: 'provisioningStatus',
        cell: (props: TL7Policy) => (
          <ProvisioningStatusComponent
            status={props.provisioningStatus}
            className="w-fit"
          />
        ),
        label: t('load-balancer:octavia_load_balancer_provisioning_status'),
        isSortable: false,
      },
      {
        id: 'operatingStatus',
        cell: (props: TL7Policy) => (
          <OperatingStatusComponent
            status={props.operatingStatus}
            className="w-fit"
          />
        ),
        label: t('load-balancer:octavia_load_balancer_operating_status'),
        isSortable: false,
      },
      {
        id: 'actions',
        cell: (props: TL7Policy) => (
          <div className="min-w-16">
            <ActionsComponent l7PoliciesId={props.id} />
          </div>
        ),
        label: '',
        isSortable: false,
      },
    ],
    [t, navigate],
  );

  return (
    <>
      <div className="header mt-8">
        <Headers
          description={t('octavia_load_balancer_list_l7_policies_description')}
          title={t('octavia_load_balancer_list_l7_policies_title')}
        />
      </div>

      <div className="sm:flex items-center justify-between mt-4">
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.stroked}
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
            className="mr-2"
            color={ODS_THEME_COLOR_INTENT.primary}
          />
          {t('octavia_load_balancer_list_l7_policies_add_button')}
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
                key: 'search',
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
              {t('filter:common_criteria_adder_filter_label')}
            </OsdsButton>
            <OsdsPopoverContent>
              <FilterAdd
                columns={[
                  {
                    id: 'position',
                    label: t('octavia_load_balancer_list_l7_policies_position'),
                    comparators: FilterCategories.Numeric,
                  },
                  {
                    id: 'name',
                    label: t('octavia_load_balancer_list_l7_policies_name'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'action',
                    label: t('octavia_load_balancer_list_l7_policies_action'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'attribute',
                    label: t(
                      'octavia_load_balancer_list_l7_policies_attribute',
                    ),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'redirectHttpCode',
                    label: t(
                      'octavia_load_balancer_list_l7_policies_redirect_code',
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

      {isPending ? (
        <OsdsSpinner
          inline
          size={ODS_SPINNER_SIZE.md}
          data-testid="List-spinner"
        />
      ) : (
        <Datagrid
          columns={columns}
          items={paginatedL7Policies?.rows || []}
          totalItems={paginatedL7Policies?.totalRows || 0}
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
    </>
  );
}
