import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { OsdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  getVcdDatacentreComputeRoute,
  getVdcComputeQueryKey,
  VCDCompute,
} from '@ovh-ux/manager-module-vcd-api';
import DatagridContainer from '@/components/datagrid/container/DatagridContainer.component';
import { subRoutes, urls } from '@/routes/routes.constant';
import { VHOST_LABEL, VHOSTS_LABEL } from './DatacentreCompute.constants';
import { ID_LABEL } from '../../dashboard.constants';

const DatagridIdCell = (vcdCompute: VCDCompute) => (
  <DataGridTextCell>{vcdCompute?.id}</DataGridTextCell>
);
const DatagridVHostProfilCell = (vcdCompute: VCDCompute) => (
  <DataGridTextCell>{vcdCompute?.currentState?.profile}</DataGridTextCell>
);

const DatagridCpuCountCell = (vcdCompute: VCDCompute) => (
  <DataGridTextCell>{vcdCompute.currentState?.vCPUCount}</DataGridTextCell>
);
const DatagridBillingCell = (vcdCompute: VCDCompute) => {
  const { t } = useTranslation('datacentres/compute');
  return (
    <DataGridTextCell>
      {t(
        `managed_vcd_vdc_compute_billing_${vcdCompute.currentState?.billingType}`,
      )}
    </DataGridTextCell>
  );
};

const DatagridRamCountCell = (vcdCompute: VCDCompute) => {
  const { t } = useTranslation('datacentres');

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
  const { t } = useTranslation('datacentres/compute');
  const { t: tVdc } = useTranslation('datacentres');
  const navigate = useNavigate();

  const columns = [
    {
      id: 'id',
      cell: DatagridIdCell,
      label: ID_LABEL,
      isSortable: false,
    },
    {
      id: 'vHostProfile',
      cell: DatagridVHostProfilCell,
      label: VHOST_LABEL,
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
      title={VHOSTS_LABEL}
      queryKey={getVdcComputeQueryKey(vdcId)}
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
