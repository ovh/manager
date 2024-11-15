import { DataGridTextCell, Links } from '@ovh-ux/manager-react-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getVcdDatacentresQueryKey,
  getVcdDatacentresRoute,
  VCDDatacentre,
} from '@ovh-ux/manager-module-vcd-api';
import DatagridContainer, {
  TDatagridContainerProps,
} from '@/components/datagrid/container/DatagridContainer.component';
import { subRoutes, urls } from '@/routes/routes.constant';
import { capitalize } from '@/utils/capitalize';

/* ========= datagrid cells ========= */
const DatagridIdCell = (vcdDatacentre: VCDDatacentre) => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <DataGridTextCell>
      <Links
        onClickReturn={() =>
          navigate(
            urls.datacentreDashboard
              .replace(subRoutes.dashboard, id)
              .replace(subRoutes.vdcId, vcdDatacentre.id),
          )
        }
        label={vcdDatacentre.currentState.name}
      ></Links>
    </DataGridTextCell>
  );
};

const DatagridDescriptionCell = (vcdDatacentre: VCDDatacentre) => (
  <DataGridTextCell>{vcdDatacentre.currentState?.description}</DataGridTextCell>
);

const DatagridCpuCountCell = (vcdDatacentre: VCDDatacentre) => (
  <DataGridTextCell>{vcdDatacentre.currentState?.vCPUCount}</DataGridTextCell>
);

const DatagridCpuSpeedCell = (vcdDatacentre: VCDDatacentre) => {
  const { t } = useTranslation('hpc-vmware-managed-vcd/datacentres');

  return (
    <DataGridTextCell>
      {t('managed_vcd_vdc_vcpu_value', {
        speed: vcdDatacentre.currentState?.vCPUSpeed,
      })}
    </DataGridTextCell>
  );
};

const DatagridRamCountCell = (vcdDatacentre: VCDDatacentre) => {
  const { t } = useTranslation('hpc-vmware-managed-vcd/datacentres');

  return (
    <DataGridTextCell>
      {t('managed_vcd_vdc_quota_value', {
        quota: vcdDatacentre.currentState?.memoryQuota,
      })}
    </DataGridTextCell>
  );
};

const DatagridCommercialRange = (vcdDatacentre: VCDDatacentre) => (
  <DataGridTextCell>
    {capitalize(vcdDatacentre.currentState?.commercialRange)}
  </DataGridTextCell>
);

/* ======= listing page ======== */
export default function DatacentresListing() {
  const { t } = useTranslation('listing');
  const { t: tVdc } = useTranslation('hpc-vmware-managed-vcd/datacentres');
  const { id } = useParams();

  const columns = [
    {
      id: 'id',
      cell: DatagridIdCell,
      label: t('managed_vcd_listing_id'),
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
      label: tVdc('managed_vcd_vdc_vcpu_count'),
    },
    {
      id: 'ramCount',
      cell: DatagridRamCountCell,
      label: tVdc('managed_vcd_vdc_ram_count'),
    },
    {
      id: 'vCpuSpeed',
      cell: DatagridCpuSpeedCell,
      label: tVdc('managed_vcd_vdc_vcpu_speed'),
    },
  ];

  const datagridProps: TDatagridContainerProps = {
    title: tVdc('managed_vcd_vdc_title'),
    queryKey: getVcdDatacentresQueryKey(id),
    isEmbedded: true,
    route: {
      api: getVcdDatacentresRoute(id),
      onboarding: urls.onboarding,
    },
    columns,
  };

  return <DatagridContainer {...datagridProps} />;
}
