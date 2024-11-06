import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  DataGridTextCell,
  Description,
} from '@ovh-ux/manager-react-components';
import { OsdsRadio, OsdsRadioButton } from '@ovhcloud/ods-components/react';
import { ODS_RADIO_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { VCDOrderableStoragePriced } from '@ovh-ux/manager-module-vcd-api';
import { getVdcResourcePriceLabel } from '@/utils/getPricedOrderableResource';
import { useDatacentreOrderContext } from '@/context/DatacentreOrder.context';

export const StorageOrderSelectCell = (storage: VCDOrderableStoragePriced) => {
  const { selectedResource, setSelectedResource } = useDatacentreOrderContext();
  return (
    <DataGridTextCell>
      <OsdsRadio
        checked={storage.profile === selectedResource}
        id={storage.profile}
        value={storage.profile}
      >
        <OsdsRadioButton
          onClick={() => setSelectedResource(storage.profile)}
          size={ODS_RADIO_BUTTON_SIZE.xs}
          color={ODS_THEME_COLOR_INTENT.primary}
        />
      </OsdsRadio>
    </DataGridTextCell>
  );
};

export const StorageOrderTypeCell = (storage: VCDOrderableStoragePriced) => (
  <DataGridTextCell>{storage.name}</DataGridTextCell>
);

export const StorageOrderPriceCell = (storage: VCDOrderableStoragePriced) => {
  const { t } = useTranslation('hpc-vmware-managed-vcd/datacentres/order');
  return (
    <DataGridTextCell>
      <Description className="font-semibold">
        {getVdcResourcePriceLabel(storage)}
      </Description>
      <Description>{t('managed_vcd_vdc_order_price_detail')}</Description>
    </DataGridTextCell>
  );
};
