import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import IVcdStorage from '@/types/vcd-storage.interface';
import DatagridContainer, {
  TDatagridContainerProps,
} from '@/components/datagrid/container/DatagridContainer.component';
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
  const { t } = useTranslation('hpc-vmware-managed-vcd/datacentres/storage');
  return (
    <DataGridTextCell>
      {t(
        `managed_vcd_vdc_storage_billing_${vcdStorage?.currentState?.billingType}`,
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

  const columns = [
    {
      id: 'id',
      cell: DatagridIdCell,
      label: t('managed_vcd_vdc_storage_id'),
    },
    {
      id: 'name',
      cell: DatagridNameCell,
      label: t('managed_vcd_vdc_storage_name'),
    },
    {
      id: 'profile',
      cell: DatagridProfileCell,
      label: t('managed_vcd_vdc_storage_profile'),
    },
    {
      id: 'type',
      cell: DatagridTypeCell,
      label: t('managed_vcd_vdc_storage_type'),
    },
    {
      id: 'capacity',
      cell: DatagridCapacityCell,
      label: t('managed_vcd_vdc_storage_capacity'),
    },
    {
      id: 'billing',
      cell: DatagridBillingCell,
      label: t('managed_vcd_vdc_storage_billing'),
    },
    {
      id: 'state',
      cell: DatagridStateCell,
      label: t('managed_vcd_vdc_storage_state'),
    },
  ];

  const datagridProps: TDatagridContainerProps = {
    title: STORAGE_TITLE,
    containerId: `storage-${id}-${vdcId}`,
    isEmbedded: true,
    route: {
      api: getVcdDatacentreStorageRoute(id, vdcId),
      onboarding: null, // TODO update with order storage page when available
    },
    columns,
  };

  return <DatagridContainer {...datagridProps} />;
}
