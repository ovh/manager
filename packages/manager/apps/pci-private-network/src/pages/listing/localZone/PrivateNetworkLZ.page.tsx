import { useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OsdsTabPanel } from '@ovhcloud/ods-components/react';
import {
  Datagrid,
  useColumnFilters,
  useDatagridSearchParams,
} from '@ovh-ux/manager-react-components';
import {
  applyFilters,
  Filter,
  FilterCategories,
  FilterComparator,
} from '@ovh-ux/manager-core-api';
import { PrivateNetworkTabName } from '../ListingLayout.constant';
import { useActiveTab } from '@/hooks/useActiveTab/useActiveTab';
import { usePrivateNetworkLZColumns } from '@/hooks/useColumns/useColumns';
import { usePrivateNetworkLZ } from '@/data/hooks/networks/useNetworks';
import { paginateResults } from '@/utils/utils';
import DataGridHeaderActions, {
  ColumnFilter,
} from '@/components/datagrid-header-actions/DatagridHeaderActions.component';

const PrivateNetworkLZ: React.FC = () => {
  const { t } = useTranslation('listing');
  const activeTab = useActiveTab();
  const { pagination, setPagination } = useDatagridSearchParams();
  const columns = usePrivateNetworkLZColumns();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data: networks } = usePrivateNetworkLZ(projectId);
  const { filters, addFilter, removeFilter } = useColumnFilters();

  const data = useMemo(
    () => paginateResults(applyFilters(networks, filters), pagination),
    [networks, filters, pagination],
  );

  const columnFilters = [
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
      label: 'CIDR',
      comparators: FilterCategories.String,
    },
    {
      id: 'allocatedIp',
      label: t('pci_projects_project_network_private_ip_allocation'),
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
    <OsdsTabPanel
      active={activeTab === PrivateNetworkTabName.LOCAL_ZONE_TAB_NAME}
      name={PrivateNetworkTabName.LOCAL_ZONE_TAB_NAME}
    >
      <DataGridHeaderActions
        createLabel={t('pci_projects_project_network_private_create')}
        onCreate={() => navigate('../new')}
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

export default PrivateNetworkLZ;
