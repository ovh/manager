import { DataGridTextCell, Links } from '@ovhcloud/manager-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import DatagridContainer, {
  TDatagridContainerProps,
} from '@/components/datagrid/container/DatagridContainer.component';
import { urls } from '@/routes/routes.constant';
import IVcdDatacentre from '@/types/vcd-datacenter.interface';

/* ========= datagrid cells ========= */
const DatagridIdCell = (vcdDatacentre: IVcdDatacentre) => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <DataGridTextCell>
      <Links
        onClickReturn={() => navigate(`/${id}/datacentres/${vcdDatacentre.id}`)}
        label={vcdDatacentre.id}
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
  const { t } = useTranslation('listing/datacentres');

  return (
    <DataGridTextCell>
      {t('managed_vcd_listing_vdc_vcpu_value', {
        speed: vcdDatacentre.currentState?.vCPUSpeed,
      })}
    </DataGridTextCell>
  );
};

const DatagridRamCountCell = (vcdDatacentre: IVcdDatacentre) => {
  const { t } = useTranslation('listing/datacentres');

  return (
    <DataGridTextCell>
      {t('managed_vcd_listing_vdc_quota_value', {
        quota: vcdDatacentre.currentState?.memoryQuota,
      })}
    </DataGridTextCell>
  );
};

const DatagridDiskSpaceCell = (vcdDatacentre: IVcdDatacentre) => {
  const { t } = useTranslation('listing/datacentres');
  return (
    <DataGridTextCell>
      {t('managed_vcd_listing_vdc_quota_value', {
        quota: vcdDatacentre.currentState?.storageQuota,
      })}
    </DataGridTextCell>
  );
};

/* ======= listing page ======== */
export default function DatacentresListing() {
  const { t } = useTranslation('listing');
  const { t: tListingVdc } = useTranslation('listing/datacentres');
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
      id: 'cpuCount',
      cell: DatagridCpuCountCell,
      label: tListingVdc('managed_vcd_listing_vdc_cpu_count'),
    },
    {
      id: 'ramCount',
      cell: DatagridRamCountCell,
      label: tListingVdc('managed_vcd_listing_vdc_ram_count'),
    },
    {
      id: 'diskSpace',
      cell: DatagridDiskSpaceCell,
      label: tListingVdc('managed_vcd_listing_vdc_disk_space_count'),
    },

    {
      id: 'vCpuSpeed',
      cell: DatagridCpuSpeedCell,
      label: tListingVdc('managed_vcd_listing_vdc_vcpu_speed'),
    },
  ];

  const datagridProps: TDatagridContainerProps = {
    title: tListingVdc('managed_vcd_listing_vdc_title'),
    containerId: `vdcs-${id}`,
    isEmbedded: true,
    route: {
      api: `/vmwareCloudDirector/organization/${id}/virtualDataCenter`,
      onboarding: urls.onboarding,
    },
    columns,
  };

  return <DatagridContainer {...datagridProps} />;
}
