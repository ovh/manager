import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OsdsTabPanel } from '@ovhcloud/ods-components/react';
import {
  Datagrid,
  useColumnFilters,
  useDatagridSearchParams,
} from '@ovh-ux/manager-react-components';
import {
  Filter,
  FilterCategories,
  FilterComparator,
} from '@ovh-ux/manager-core-api';
import { PrivateNetworkTabName } from '../ListingLayout.constant';
import { usePrivateNetworkColumns } from '@/hooks/useColumns/useColumns';
import { usePrivateNetworksRegion } from '@/data/hooks/networks/useNetworks';
import DataGridHeaderActions, {
  ColumnFilter,
} from '@/components/datagrid-header-actions/DatagridHeaderActions.component';

const PrivateNetworkRegion: React.FC = () => {
  const { t } = useTranslation('listing');
  const columns = usePrivateNetworkColumns();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const { pagination, setPagination } = useDatagridSearchParams();

  const data = usePrivateNetworksRegion(projectId, pagination, filters);

  const columnFilters = [
    {
      id: 'vlanId',
      label: t('pci_projects_project_network_private_vlan_id'),
      comparators: FilterCategories.String,
    },
    {
      id: 'name',
      label: t('pci_projects_project_network_private_name'),
      comparators: FilterCategories.String,
    },
  ];

  const initializePagination = useCallback(() => {
    setPagination({
      pageIndex: 0,
      pageSize: pagination.pageSize,
    });
  }, [pagination]);

  const handleSearch = useCallback(({ detail }) => {
    initializePagination();
    addFilter({
      key: 'search',
      value: detail.inputValue,
      comparator: FilterComparator.Includes,
      label: '',
    });
  }, []);

  const handleAddFilter = useCallback(
    (addedFilter: Filter, column: ColumnFilter) => {
      initializePagination();
      addFilter({
        ...addedFilter,
        label: column.label,
      });
    },
    [],
  );

  return (
    <OsdsTabPanel name={PrivateNetworkTabName.GLOBAL_REGIONS_TAB_NAME}>
      <DataGridHeaderActions
        createLabel={t('pci_projects_project_network_private_create')}
        onCreate={() => navigate('./new')}
        onSearch={handleSearch}
        filters={filters}
        removeFilter={removeFilter}
        columnFilters={columnFilters}
        handleAddFilter={handleAddFilter}
      />
      <div className="mt-10">
        <Datagrid
          columns={columns}
          items={data.rows}
          totalItems={data.totalRows}
          pagination={pagination}
          onPaginationChange={setPagination}
        />
      </div>
    </OsdsTabPanel>
  );
};

export default PrivateNetworkRegion;
