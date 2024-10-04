import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterCategories } from '@ovh-ux/manager-core-api';
import {
  Datagrid,
  FilterAdd,
  FilterList,
  useColumnFilters,
  useDataGrid,
} from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import { useStreams } from '../../api/hook/useDbaasLogs';
import { TDbaasLog } from '../../api/data/dbaas-logs';
import { useStreamsListColumns } from './useStreamsListColumns';

import '../../translations/logs';

export interface StreamListProps {
  account: TDbaasLog;
  serviceName: string;
}

export function StreamsList({
  account,
  serviceName,
}: Readonly<StreamListProps>) {
  const { t } = useTranslation('pci-logs');
  const { t: tFilter } = useTranslation('filter');
  const { pagination, setPagination } = useDataGrid();
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const { data: streams, isPending } = useStreams(
    account.serviceName,
    pagination,
    filters,
  );
  const columns = useStreamsListColumns({
    account,
    serviceName,
  });
  const filterPopoverRef = useRef(undefined);

  if (isPending)
    return (
      <div className="text-center">
        <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
      </div>
    );
  return (
    <>
      <div className="flex justify-end">
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
                  id: 'title',
                  label: t('list_column_stream_name'),
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
      <div className="my-5">
        <FilterList filters={filters} onRemoveFilter={removeFilter} />
      </div>
      <Datagrid
        columns={columns}
        items={streams?.data || []}
        totalItems={streams?.totalCount || 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        className="overflow-x-visible"
      />
    </>
  );
}
