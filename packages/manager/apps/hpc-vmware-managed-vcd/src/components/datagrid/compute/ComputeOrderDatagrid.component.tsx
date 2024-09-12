import React, { SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  DataGridTextCell,
  Description,
} from '@ovh-ux/manager-react-components';
import { OsdsRadio, OsdsRadioButton } from '@ovhcloud/ods-components/react';
import { ODS_RADIO_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import DatagridContainer from '@/components/datagrid/container/DatagridContainer.component';
import { getVcdDatacentreComputeRoute } from '@/data/api/hpc-vmware-managed-vcd-datacentre';
import { IVcdOrderableCompute } from '@/types/vcd-compute.interface';

type DatagridComputeOrderProps = {
  selectedVhost: string;
  onSelectVhost: React.Dispatch<SetStateAction<string>>;
};

const ComputeOrderVhostCell = (vcdCompute: IVcdOrderableCompute) => (
  <DataGridTextCell>{vcdCompute?.currentState?.profile}</DataGridTextCell>
);
const ComputeOrderCpuSpeedCell = (vcdCompute: IVcdOrderableCompute) => (
  <DataGridTextCell>{vcdCompute?.currentState?.vCPUSpeed}</DataGridTextCell>
);
const ComputeOrderRamCell = (vcdCompute: IVcdOrderableCompute) => (
  <DataGridTextCell>{vcdCompute?.currentState?.memoryQuota}</DataGridTextCell>
);
const ComputeOrderCpuCountCell = (vcdCompute: IVcdOrderableCompute) => (
  <DataGridTextCell>{vcdCompute?.currentState?.vCPUCount}</DataGridTextCell>
);
const ComputeOrderPriceCell = () => {
  const { t } = useTranslation('hpc-vmware-managed-vcd/datacentres/compute');

  // TODO: get formatted price
  return (
    <DataGridTextCell>
      <Description className="font-semibold">{'42.00€'}</Description>
      <Description>
        {t('managed_vcd_vdc_compute_order_price_detail')}
      </Description>
    </DataGridTextCell>
  );
};

export const ComputeOrderDatagrid = ({
  selectedVhost,
  onSelectVhost,
}: DatagridComputeOrderProps) => {
  const { id, vdcId } = useParams();
  const { t } = useTranslation('hpc-vmware-managed-vcd/datacentres/compute');

  const columns = [
    {
      id: 'select',
      cell: (vhost: IVcdOrderableCompute) => (
        <DataGridTextCell>
          <OsdsRadio
            checked={vhost?.id === selectedVhost}
            id={vhost.id}
            value={vhost.id}
          >
            <OsdsRadioButton
              onClick={() => onSelectVhost(vhost.id)}
              size={ODS_RADIO_BUTTON_SIZE.sm}
              color={ODS_THEME_COLOR_INTENT.primary}
            />
          </OsdsRadio>
        </DataGridTextCell>
      ),
      isSortable: false,
    },
    {
      id: 'vhost',
      cell: ComputeOrderVhostCell,
      label: t('managed_vcd_vdc_compute_order_vhost'),
      isSortable: false,
    },
    {
      id: 'cpuSpeed',
      cell: ComputeOrderCpuSpeedCell,
      label: t('managed_vcd_vdc_compute_order_cpu_speed'),
      isSortable: false,
    },
    {
      id: 'ram',
      cell: ComputeOrderRamCell,
      label: t('managed_vcd_vdc_compute_order_ram'),
      isSortable: false,
    },
    {
      id: 'cpuCount',
      cell: ComputeOrderCpuCountCell,
      label: t('managed_vcd_vdc_compute_order_vcpu_count'),
      isSortable: false,
    },
    {
      id: 'price',
      cell: ComputeOrderPriceCell,
      label: t('managed_vcd_vdc_compute_order_price'),
    },
  ];

  // TODO: replace with Datagrid from manager-react-components
  return (
    <DatagridContainer
      title={''}
      containerId={`compute-order-${id}-${vdcId}`}
      columns={columns}
      route={{
        api: getVcdDatacentreComputeRoute(id, vdcId),
        onboarding: null, // TODO update with order compute page when available
      }}
      isEmbedded
    />
  );
};
