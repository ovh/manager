import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { OsdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { VHOSTS_TITLE } from './DatacentreCompute.constants';
import DatagridContainer from '@/components/datagrid/container/DatagridContainer.component';
import IVcdCompute from '@/types/vcd-compute.interface';
import { getVcdDatacentreComputeRoute } from '@/data/api/hpc-vmware-managed-vcd-datacentre';
import { subRoutes, urls } from '@/routes/routes.constant';
import { getVdcComputeQueryKey } from '@/data/hooks/useManagedVcdDatacentres';

const DatagridIdCell = (vcdCompute: IVcdCompute) => (
  <DataGridTextCell>{vcdCompute?.id}</DataGridTextCell>
);
const DatagridVHostProfilCell = (vcdCompute: IVcdCompute) => (
  <DataGridTextCell>{vcdCompute?.currentState?.profile}</DataGridTextCell>
);

const DatagridCpuCountCell = (vcdCompute: IVcdCompute) => (
  <DataGridTextCell>{vcdCompute.currentState?.vCPUCount}</DataGridTextCell>
);
const DatagridBillingCell = (vcdCompute: IVcdCompute) => {
  const { t } = useTranslation('hpc-vmware-managed-vcd/datacentres/compute');
  return (
    <DataGridTextCell>
      {t(
        `managed_vcd_vdc_compute_billing_${vcdCompute.currentState?.billingType}`,
      )}
    </DataGridTextCell>
  );
};

const DatagridRamCountCell = (vcdCompute: IVcdCompute) => {
  const { t } = useTranslation('hpc-vmware-managed-vcd/datacentres');

  return (
    <DataGridTextCell>
      {t('managed_vcd_vdc_quota_value', {
        quota: vcdCompute.currentState?.memoryQuota,
      })}
    </DataGridTextCell>
  );
};

export default function ComputeListingPage() {
  const { id, vdcId } = useParams();
  const { t } = useTranslation('hpc-vmware-managed-vcd/datacentres/compute');
  const { t: tVdc } = useTranslation('hpc-vmware-managed-vcd/datacentres');
  const navigate = useNavigate();

  const columns = [
    {
      id: 'id',
      cell: DatagridIdCell,
      label: t('managed_vcd_vdc_compute_id'),
      isSortable: false,
    },
    {
      id: 'vHostProfile',
      cell: DatagridVHostProfilCell,
      label: t('managed_vcd_vdc_compute_vhost_profile'),
      isSortable: false,
    },
    {
      id: 'cpuCount',
      cell: DatagridCpuCountCell,
      label: tVdc('managed_vcd_vdc_vcpu_count'),
      isSortable: false,
    },
    {
      id: 'ramCount',
      cell: DatagridRamCountCell,
      label: tVdc('managed_vcd_vdc_ram_count'),
      isSortable: false,
    },
    {
      id: 'billing',
      cell: DatagridBillingCell,
      label: t('managed_vcd_vdc_compute_billing'),
      isSortable: false,
    },
  ];

  return (
    <DatagridContainer
      title={VHOSTS_TITLE}
      queryKey={getVdcComputeQueryKey(id, vdcId)}
      columns={columns}
      route={{
        api: getVcdDatacentreComputeRoute(id, vdcId),
        onboarding: urls.datacentreComputeOrder
          .replace(subRoutes.dashboard, id)
          .replace(subRoutes.vdcId, vdcId),
      }}
      isEmbedded
      orderButton={
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => navigate(subRoutes.order)}
        >
          {t('managed_vcd_vdc_compute_order_cta')}
        </OsdsButton>
      }
    />
  );
}
