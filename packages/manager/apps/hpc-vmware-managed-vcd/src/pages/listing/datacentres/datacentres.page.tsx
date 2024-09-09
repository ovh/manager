import { DataGridTextCell, Links } from '@ovh-ux/manager-react-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import DatagridContainer, {
  TDatagridContainerProps,
} from '@/components/datagrid/container/DatagridContainer.component';
import { urls } from '@/routes/routes.constant';
import IVcdDatacentre from '@/types/vcd-datacenter.interface';
import { getVcdDatacentresRoute } from '@/data/api/hpc-vmware-managed-vcd-datacentre';

/* ========= datagrid cells ========= */
const DatagridIdCell = (vcdDatacentre: IVcdDatacentre) => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <DataGridTextCell>
      <Links
        onClickReturn={() => navigate(`/${id}/datacentres/${vcdDatacentre.id}`)}
        label={vcdDatacentre.currentState.name}
      ></Links>
    </DataGridTextCell>
  );
};

const DatagridDescriptionCell = (vcdDatacentre: IVcdDatacentre) => (
  <DataGridTextCell>{vcdDatacentre.currentState?.description}</DataGridTextCell>
);

const DatagridCpuCountCell = (vcdDatacentre: IVcdDatacentre) => (
  <DataGridTextCell>{vcdDatacentre.currentState?.vCPUCount}</DataGridTextCell>
);

const DatagridCpuSpeedCell = (vcdDatacentre: IVcdDatacentre) => {
  const { t } = useTranslation('hpc-vmware-managed-vcd/datacentres');

  return (
    <DataGridTextCell>
      {t('managed_vcd_vdc_vcpu_value', {
        speed: vcdDatacentre.currentState?.vCPUSpeed,
      })}
    </DataGridTextCell>
  );
};

const DatagridRamCountCell = (vcdDatacentre: IVcdDatacentre) => {
  const { t } = useTranslation('hpc-vmware-managed-vcd/datacentres');

  return (
    <DataGridTextCell>
      {t('managed_vcd_vdc_quota_value', {
        quota: vcdDatacentre.currentState?.memoryQuota,
      })}
    </DataGridTextCell>
  );
};

const DatagridCommercialRange = (vcdDatacentre: IVcdDatacentre) => (
  <DataGridTextCell>
    {vcdDatacentre.currentState?.commercialRange}
  </DataGridTextCell>
);

const DatagridDiskSpaceCell = (vcdDatacentre: IVcdDatacentre) => {
  const { t } = useTranslation('hpc-vmware-managed-vcd/datacentres');
  return (
    <DataGridTextCell>
      {t('managed_vcd_vdc_quota_value', {
        quota: vcdDatacentre.currentState?.storageQuota,
      })}
    </DataGridTextCell>
  );
};

/* ======= listing page ======== */
export default function DatacentresListing() {
  const { t } = useTranslation('listing');
  const { t: tVdc } = useTranslation('hpc-vmware-managed-vcd/datacentres');
  const { id } = useParams();

  const columns = [
    {
      id: 'name',
      cell: DatagridIdCell,
      label: t('managed_vcd_listing_name'),
    },
    {
      id: 'description',
      cell: DatagridDescriptionCell,
      label: t('managed_vcd_listing_description'),
    },
    {
      id: 'commercialRange',
      cell: DatagridCommercialRange,
      label: tVdc('managed_vcd_vdc_commercial_range'),
    },
    {
      id: 'cpuCount',
      cell: DatagridCpuCountCell,
      label: tVdc('managed_vcd_vdc_cpu_count'),
    },
    {
      id: 'ramCount',
      cell: DatagridRamCountCell,
      label: tVdc('managed_vcd_vdc_ram_count'),
    },
    {
      id: 'diskSpace',
      cell: DatagridDiskSpaceCell,
      label: tVdc('managed_vcd_vdc_disk_space_count'),
    },
    {
      id: 'vCpuSpeed',
      cell: DatagridCpuSpeedCell,
      label: tVdc('managed_vcd_vdc_vcpu_speed'),
    },
  ];

  const datagridProps: TDatagridContainerProps = {
    title: tVdc('managed_vcd_vdc_title'),
    containerId: `vdcs-${id}`,
    isEmbedded: true,
    route: {
      api: getVcdDatacentresRoute(id),
      onboarding: urls.onboarding,
    },
    columns,
  };

  return <DatagridContainer {...datagridProps} />;
}
