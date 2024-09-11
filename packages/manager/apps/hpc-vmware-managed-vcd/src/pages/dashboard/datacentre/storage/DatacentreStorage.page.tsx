import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import IVcdStorage from '@/types/vcd-storage.interface';
import DatagridContainer from '@/components/datagrid/container/DatagridContainer.component';
import { STORAGE_TITLE } from '../DatacentreDashboard.constant';
import { getVcdDatacentreStorageRoute } from '@/data/api/hpc-vmware-managed-vcd-datacentre';

const DatagridIdCell = (vcdStorage: IVcdStorage) => (
  <DataGridTextCell>{vcdStorage?.id}</DataGridTextCell>
);
const DatagridNameCell = (vcdStorage: IVcdStorage) => (
  <DataGridTextCell>{vcdStorage?.currentState?.name}</DataGridTextCell>
);
const DatagridProfileCell = (vcdStorage: IVcdStorage) => (
  <DataGridTextCell>{vcdStorage?.currentState?.profile}</DataGridTextCell>
);
const DatagridTypeCell = (vcdStorage: IVcdStorage) => (
  <DataGridTextCell>{vcdStorage?.currentState?.type}</DataGridTextCell>
);
const DatagridCapacityCell = (vcdStorage: IVcdStorage) => (
  <DataGridTextCell>{vcdStorage?.currentState.capacity}</DataGridTextCell>
);
const DatagridBillingCell = (vcdStorage: IVcdStorage) => {
  const { t } = useTranslation('hpc-vmware-managed-vcd/datacentres/compute');
  return (
    <DataGridTextCell>
      {t(
        `managed_vcd_vdc_compute_billing_${vcdStorage?.currentState?.billingType}`,
      )}
    </DataGridTextCell>
  );
};
const DatagridStateCell = (vcdStorage: IVcdStorage) => (
  <DataGridTextCell>{vcdStorage?.resourceStatus}</DataGridTextCell>
);

export default function StorageListingPage() {
  const { id, vdcId } = useParams();
  const { t } = useTranslation('hpc-vmware-managed-vcd/datacentres/storage');
  const { t: tVdc } = useTranslation('hpc-vmware-managed-vcd/datacentres');
  const { t: tCompute } = useTranslation(
    'hpc-vmware-managed-vcd/datacentres/compute',
  );

  const columns = [
    {
      id: 'id',
      cell: DatagridIdCell,
      label: tVdc('managed_vcd_vdc_id'),
      isSortable: false,
    },
    {
      id: 'name',
      cell: DatagridNameCell,
      label: t('managed_vcd_vdc_storage_name'),
      isSortable: false,
    },
    {
      id: 'profile',
      cell: DatagridProfileCell,
      label: t('managed_vcd_vdc_storage_profile'),
      isSortable: false,
    },
    {
      id: 'type',
      cell: DatagridTypeCell,
      label: t('managed_vcd_vdc_storage_type'),
      isSortable: false,
    },
    {
      id: 'capacity',
      cell: DatagridCapacityCell,
      label: t('managed_vcd_vdc_storage_capacity'),
      isSortable: false,
    },
    {
      id: 'billing',
      cell: DatagridBillingCell,
      label: tCompute('managed_vcd_vdc_compute_billing'),
      isSortable: false,
    },
    {
      id: 'state',
      cell: DatagridStateCell,
      label: t('managed_vcd_vdc_storage_state'),
      isSortable: false,
    },
  ];

  return (
    <DatagridContainer
      title={STORAGE_TITLE}
      containerId={`storage-${id}-${vdcId}`}
      columns={columns}
      route={{
        api: getVcdDatacentreStorageRoute(id, vdcId),
        onboarding: null, // TODO update with order storage page when available
      }}
      isEmbedded
    />
  );
}
