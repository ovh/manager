import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Description, Subtitle } from '@ovh-ux/manager-react-components';
import { OsdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { subRoutes } from '@/routes/routes.constant';
import { QuantitySelector } from '@/components/datagrid/compute/QuantitySelector.component';
import { ComputeOrderDatagrid } from '@/components/datagrid/compute/ComputeOrderDatagrid.component';
import {
  COMPUTE_ORDER_MAX_QUANTITY,
  COMPUTE_ORDER_MIN_QUANTITY,
} from './DatacentreComputeOrder.constants';

export default function ComputeOrderPage() {
  const { t } = useTranslation('hpc-vmware-managed-vcd/datacentres/compute');
  const navigate = useNavigate();
  const [selectedVhost, setSelectedVhost] = useState<string>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const isValidQuantity =
    selectedQuantity >= COMPUTE_ORDER_MIN_QUANTITY &&
    selectedQuantity <= COMPUTE_ORDER_MAX_QUANTITY;

  return (
    <div className="px-10 mt-4 mb-10 flex flex-col">
      <Subtitle>{t('managed_vcd_vdc_compute_order_title')}</Subtitle>
      <Description>{t('managed_vcd_vdc_compute_order_subtitle')}</Description>
      <ComputeOrderDatagrid
        selectedVhost={selectedVhost}
        onSelectVhost={(vhostId) => setSelectedVhost(vhostId)}
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
