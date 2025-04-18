import React from 'react';
import { useTranslation } from 'react-i18next';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { OdsRadio, OdsText } from '@ovhcloud/ods-components/react';
import { VCDOrderableStoragePriced } from '@ovh-ux/manager-module-vcd-api';
import { getVdcResourcePriceLabel } from '@/utils/getPricedOrderableResource';
import { useDatacentreOrderContext } from '@/context/DatacentreOrder.context';
import { IOPS_LABEL } from '@/utils/label.constants';

export const StorageOrderSelectCell = (storage: VCDOrderableStoragePriced) => {
  const { selectedResource, setSelectedResource } = useDatacentreOrderContext();
  return (
    <DataGridTextCell>
      <OdsRadio
        name="radio-order-storage"
        value={storage.profile}
        isChecked={storage.profile === selectedResource}
        onOdsChange={() => setSelectedResource(storage.profile)}
      />
    </DataGridTextCell>
  );
};

export const StorageOrderTypeCell = ({ name }: VCDOrderableStoragePriced) => (
  <DataGridTextCell>{name}</DataGridTextCell>
);

export const StorageOrderPriceCell = (storage: VCDOrderableStoragePriced) => {
  const { t } = useTranslation('datacentres/order');
  return (
    <DataGridTextCell>
      <OdsText className="semibold block">
        {getVdcResourcePriceLabel(storage)}
      </OdsText>
      <OdsText>{t('managed_vcd_vdc_order_price_detail')}</OdsText>
    </DataGridTextCell>
  );
};

export const StoragePerformanceClassCell = ({
  performanceClass,
}: VCDOrderableStoragePriced) => {
  const { t } = useTranslation('datacentres/order');
  return (
    <DataGridTextCell>
      {t('managed_vcd_vdc_order_performance_class', {
        performanceClass: `${performanceClass} ${IOPS_LABEL}`,
      })}
    </DataGridTextCell>
  );
};
