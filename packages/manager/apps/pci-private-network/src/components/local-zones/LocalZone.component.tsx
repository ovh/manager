import {
  Datagrid,
  FilterAdd,
  FilterList,
  Notifications,
  useColumnFilters,
  useDataGrid,
} from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsDivider,
  OsdsIcon,
  OsdsMessage,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSearchBar,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FilterCategories, FilterComparator } from '@ovh-ux/manager-core-api';
import { useNavigate } from 'react-router-dom';
import {
  useAggregatedLocalNetworks,
  useLocalZoneNetworks,
} from '@/api/hooks/useNetwork';
import { useProjectRegions } from '@/api/hooks/useRegions';
import { PRIVATE_NETWORK_LIST } from '@/constants';
import { useDatagridColumn } from '@/hooks/useDatagridColumn';

type TLocalZoneComponent = {
  projectId: string;
};
export default function LocalZoneComponent({
  projectId,
}: Readonly<TLocalZoneComponent>) {
  const { t } = useTranslation(['listing']);
  const { t: tFilter } = useTranslation('filter');
  const { t: tError } = useTranslation('error');

  const [searchField, setSearchField] = useState('');
  const { pagination, setPagination } = useDataGrid();
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const filterPopoverRef = useRef(undefined);
  const navigate = useNavigate();

  const { data: regions } = useProjectRegions(projectId);

  const { data: aggregatedNetworks } = useAggregatedLocalNetworks(
    projectId,
    regions,
  );

  const { data: localZoneNetworks, isFetching, error } = useLocalZoneNetworks(
    projectId,
    aggregatedNetworks,
    pagination,
    filters,
  );

  const columns = useDatagridColumn();

  return (
    <div>
      <Notifications />

      <OsdsDivider />

      <div className="sm:flex items-center justify-between">
        <OsdsButton
          className="mr-1 xs:mb-1 sm:mb-0"
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => navigate('../new')}
        >
          <OsdsIcon
            name={ODS_ICON_NAME.ADD}
            size={ODS_ICON_SIZE.xxs}
            color={ODS_THEME_COLOR_INTENT.primary}
            className="mr-3"
          />
          {t('pci_projects_project_network_private_create')}
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
                    label: t('pci_projects_project_network_private_name'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'region',
                    label: t('pci_projects_project_network_private_region'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'cidr',
                    label: PRIVATE_NETWORK_LIST.CIDR,
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'dhcp',
                    label: PRIVATE_NETWORK_LIST.DHCP,
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'allocatedIp',
                    label: t(
                      'pci_projects_project_network_private_ip_allocation',
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

      {error && (
        <OsdsMessage className="mt-4" type={ODS_MESSAGE_TYPE.error}>
          <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
            {tError('manager_error_page_default')}
          </OsdsText>
        </OsdsMessage>
      )}

      {isFetching && (
        <div className="text-center">
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
        </div>
      )}

      {!isFetching && localZoneNetworks && (
        <div className="mt-8">
          <Datagrid
            columns={columns}
            items={localZoneNetworks?.rows || []}
            totalItems={localZoneNetworks?.totalRows || 0}
            pagination={pagination}
            onPaginationChange={setPagination}
          />
        </div>
      )}
    </div>
  );
}
