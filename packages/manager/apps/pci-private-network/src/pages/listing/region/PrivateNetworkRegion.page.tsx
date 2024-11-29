import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OsdsTabPanel } from '@ovhcloud/ods-components/react';
import {
  Datagrid,
  Notifications,
  useColumnFilters,
  useDatagridSearchParams,
} from '@ovh-ux/manager-react-components';
import { FilterCategories } from '@ovh-ux/manager-core-api';
import { PrivateNetworkTabName } from '../ListingLayout.constant';
import { usePrivateNetworkRegionColumns } from '@/hooks/useColumns/useColumns';
import { useRegionPrivateNetworks } from '@/data/hooks/networks/useNetworks';
import DataGridHeaderActions from '@/components/datagrid-header-actions/DatagridHeaderActions.component';
import { useActiveTab } from '@/hooks/useActiveTab/useActiveTab';

const PrivateNetworkRegion: React.FC = () => {
  const { t } = useTranslation('listing');
  const columns = usePrivateNetworkRegionColumns();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { filters } = useColumnFilters();
  const { pagination, setPagination } = useDatagridSearchParams();
  const activeTab = useActiveTab();

  const data = useRegionPrivateNetworks(projectId, pagination, filters);

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

  return (
    <OsdsTabPanel
      active={activeTab === PrivateNetworkTabName.GLOBAL_REGIONS_TAB_NAME}
      name={PrivateNetworkTabName.GLOBAL_REGIONS_TAB_NAME}
    >
      <Notifications />
      <DataGridHeaderActions
        createLabel={t('pci_projects_project_network_private_create')}
        onCreate={() => navigate('./new')}
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
    </OsdsTabPanel>
  );
};

export default PrivateNetworkRegion;
