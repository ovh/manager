import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Datagrid,
  DataGridTextCell,
  Description,
  ErrorBanner,
  Subtitle,
} from '@ovh-ux/manager-react-components';
import {
  OsdsButton,
  OsdsRadio,
  OsdsRadioButton,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_RADIO_BUTTON_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  COMPUTE_ORDER_MAX_QUANTITY,
  COMPUTE_ORDER_MIN_QUANTITY,
} from './DatacentreComputeOrder.constants';
import {
  ComputeOrderVhostCell,
  ComputeOrderCpuSpeedCell,
  ComputeOrderRamCell,
  ComputeOrderCpuCountCell,
  ComputeOrderPriceCell,
} from '@/components/datagrid/compute/ComputeOrderCells.component';
import Loading from '@/components/loading/Loading.component';
import { QuantitySelector } from '@/components/datagrid/compute/QuantitySelector.component';
import { subRoutes } from '@/routes/routes.constant';
import { IVdcOrderableVHost } from '@/types/vcd-vdc-orderable-resource.interface';
import { useVdcOrderableResource } from '@/data/hooks/useManagedVcdDatacentres';
import { validateComputeQuantity } from '@/utils/formValidation';

export default function ComputeOrderPage() {
  const { t } = useTranslation('hpc-vmware-managed-vcd/datacentres/compute');
  const { id, vdcId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useVdcOrderableResource(id, vdcId);
  const [selectedVhost, setSelectedVhost] = useState<string>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

  const orderableVhostList = data?.data?.compute;
  const canOrderVhost = orderableVhostList && orderableVhostList.length;
  const isValidQuantity = validateComputeQuantity(selectedQuantity);

  if (isLoading) return <Loading />;
  if (isError || !canOrderVhost) {
    return (
      <ErrorBanner
        error={{ status: 500, data: { message: 'Contact support' } }}
      />
    );
  }

  const columns = [
    {
      id: 'select',
      cell: (vhost: IVdcOrderableVHost) => (
        <DataGridTextCell>
          <OsdsRadio
            checked={vhost?.name === selectedVhost}
            id={vhost?.name}
            value={vhost?.name}
          >
            <OsdsRadioButton
              onClick={() => setSelectedVhost(vhost?.name)}
              size={ODS_RADIO_BUTTON_SIZE.sm}
              color={ODS_THEME_COLOR_INTENT.primary}
            />
          </OsdsRadio>
        </DataGridTextCell>
      ),
      label: '',
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

  return (
    <div className="px-10 my-4 flex flex-col">
      <Subtitle>{t('managed_vcd_vdc_compute_order_title')}</Subtitle>
      <Description className="my-6">
        {t('managed_vcd_vdc_compute_order_subtitle')}
      </Description>
      <Datagrid
        columns={columns}
        items={orderableVhostList}
        totalItems={0}
        contentAlignLeft
      />
      <div className="mt-10">
        <QuantitySelector
          quantity={selectedQuantity}
          setQuantity={setSelectedQuantity}
          isValid={isValidQuantity}
          title={t('managed_vcd_vdc_compute_order_quantity_title')}
          label={t('managed_vcd_vdc_compute_order_quantity_label')}
          min={COMPUTE_ORDER_MIN_QUANTITY}
          max={COMPUTE_ORDER_MAX_QUANTITY}
        />
      </div>
      <div className="flex items-center gap-x-4 mt-10">
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.ghost}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => navigate(`../${subRoutes.datacentreCompute}`)}
        >
          {t('managed_vcd_vdc_compute_order_cancel_cta')}
        </OsdsButton>
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.flat}
          color={ODS_THEME_COLOR_INTENT.primary}
          disabled={!isValidQuantity ? true : undefined}
        >
          {t('managed_vcd_vdc_compute_order_confirm_cta')}
        </OsdsButton>
      </div>
    </div>
  );
}
