import { FilterCategories } from '@ovh-ux/manager-core-api';
import {
  Datagrid,
  FilterAdd,
  FilterList,
  useColumnFilters,
  useDataGrid,
} from '@ovh-ux/manager-react-components';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsPopover,
  OdsSpinner,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { TDbaasLog } from '../../api/data/dbaas-logs';
import { useStreams } from '../../api/hook/useDbaasLogs';
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

  if (isPending)
    return (
      <div className="text-center">
        <OdsSpinner size={ODS_SPINNER_SIZE.md} />
      </div>
    );
  return (
    <>
      <div className="flex justify-end">
        <div id="popover-trigger">
          <OdsButton
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.outline}
            icon={ODS_ICON_NAME.filter}
            label={tFilter('common_criteria_adder_filter_label')}
          />
        </div>

        <OdsPopover triggerId="popover-trigger">
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
            }}
          />
        </OdsPopover>
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
