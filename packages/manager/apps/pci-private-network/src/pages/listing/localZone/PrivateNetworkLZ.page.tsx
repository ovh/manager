import { useMemo } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OsdsTabPanel } from '@ovhcloud/ods-components/react';
import {
  Datagrid,
  Notifications,
  useColumnFilters,
  useDatagridSearchParams,
} from '@ovh-ux/manager-react-components';
import { applyFilters, FilterCategories } from '@ovh-ux/manager-core-api';
import { PrivateNetworkTabName } from '../ListingLayout.constant';
import { usePrivateNetworkLZColumns } from '@/hooks/useColumns/useColumns';
import { useLZPrivateNetworks } from '@/data/hooks/networks/useNetworks';
import { paginateResults } from '@/utils/utils';
import DataGridHeaderActions from '@/components/datagrid-header-actions/DatagridHeaderActions.component';

const PrivateNetworkLZ: React.FC = () => {
  const { t } = useTranslation('listing');
  const { pagination, setPagination } = useDatagridSearchParams();
  const columns = usePrivateNetworkLZColumns();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data: networks } = useLZPrivateNetworks(projectId);
  const { filters } = useColumnFilters();

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

  return (
    <OsdsTabPanel active name={PrivateNetworkTabName.LOCAL_ZONE_TAB_NAME}>
      <Notifications />
      <DataGridHeaderActions
        createLabel={t('pci_projects_project_network_private_create')}
        onCreate={() => navigate('../new')}
        pagination={pagination}
        setPagination={setPagination}
        columnFilters={columnFilters}
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
      <Outlet />
    </OsdsTabPanel>
  );
};

export default PrivateNetworkLZ;
