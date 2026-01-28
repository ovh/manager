import { useEffect, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { OdsButton, OdsQuantity, OdsText } from '@ovhcloud/ods-components/react';

import {
  VCDOrderableStoragePriced,
  VCDOrderableVhostPriced,
  isStatusTerminated,
  useVcdCatalog,
  useVcdDatacentre,
  useVcdOrder,
  useVdcOrderableResource,
} from '@ovh-ux/manager-module-vcd-api';
import { Datagrid, DatagridColumn, RedirectionGuard } from '@ovh-ux/manager-react-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { useDatacentreOrderContext } from '@/context/DatacentreOrder.context';
import { useDatacentreParams } from '@/hooks/params/useSafeParams';
import { TRACKING } from '@/tracking.constants';
import { validateQuantity } from '@/utils/formValidation';
import { getPricedVdcResources } from '@/utils/getPricedOrderableResource';

import { DisplayStatus } from '../status/DisplayStatus';

type OrderType = 'compute' | 'storage';
type PricedResource<T extends OrderType> = T extends 'compute'
  ? VCDOrderableVhostPriced
  : VCDOrderableStoragePriced;
type OrderColumns<T extends OrderType> = DatagridColumn<PricedResource<T>>[];

interface DatacentreOrderProps<T extends OrderType> {
  orderType: T;
  columns: OrderColumns<T>;
  title: string;
  subtitles: string[];
  backLink: string;
  minQuantity?: number;
  maxQuantity?: number;
}

export const DatacentreOrder = <T extends OrderType>({
  orderType,
  columns,
  title,
  subtitles,
  backLink,
  minQuantity = 1,
  maxQuantity = 100,
}: DatacentreOrderProps<T>) => {
  const { t } = useTranslation('datacentres/order');
  const navigate = useNavigate();
  const { id, vdcId } = useDatacentreParams();
  const { trackClick } = useOvhTracking();
  const {
    data: vcdDatacentre,
    isPending: isLoadingDatacentre,
    error: datacentreError,
  } = useVcdDatacentre(id, vdcId);
  const { selectedResource, setSelectedResource, selectedQuantity, setSelectedQuantity } =
    useDatacentreOrderContext();
  const {
    data: orderableResource,
    isPending: isLoadingResource,
    error: resourceError,
  } = useVdcOrderableResource(id, vdcId);
  const { data: catalog, isPending: isLoadingCatalog, error: catalogError } = useVcdCatalog(id);
  const { redirectToOrder } = useVcdOrder({
    serviceName: id,
    planCode: selectedResource,
    quantity: selectedQuantity,
    vdcOrgId: vdcId,
  });

  const isValidQuantity = validateQuantity({
    quantity: selectedQuantity,
    min: minQuantity,
    max: maxQuantity,
  });

  const pricedResources: PricedResource<T>[] = useMemo(() => {
    if (!catalog?.data || !orderableResource?.data) return [];

    return getPricedVdcResources({
      catalog: catalog.data,
      resources:
        orderType === 'compute' ? orderableResource.data.compute : orderableResource.data.storage,
    });
  }, [catalog, orderableResource, orderType]) as PricedResource<T>[];

  useEffect(() => {
    if (pricedResources?.[0] && !selectedResource) {
      setSelectedResource(pricedResources[0].profile);
    }
  }, [selectedResource, pricedResources, setSelectedResource]);

  if (isLoadingDatacentre || isLoadingResource || isLoadingCatalog) {
    return <DisplayStatus variant="loading" />;
  }
  const queryError = datacentreError || resourceError || catalogError;
  if (queryError) return <DisplayStatus variant="error" error={queryError} />;

  return (
    <RedirectionGuard
      isLoading={false}
      condition={isStatusTerminated(vcdDatacentre.data.resourceStatus)}
      route={'..'}
    >
      <div className="my-4 flex flex-col px-10">
        <OdsText preset="heading-3">{title}</OdsText>
        {subtitles && (
          <div className="my-6 flex flex-col">
            {subtitles.map((text) => (
              <OdsText key={text}>{text}</OdsText>
            ))}
          </div>
        )}
        <Datagrid
          columns={columns}
          items={pricedResources}
          totalItems={pricedResources.length}
          contentAlignLeft
        />
        <div className="mt-10">
          <OdsText preset="heading-3">{t('managed_vcd_vdc_order_quantity_title')}</OdsText>
          <div className="flex flex-col items-start">
            <OdsText class="my-2">{t('managed_vcd_vdc_order_quantity_label')}</OdsText>
            <OdsQuantity
              name="order-quantity"
              min={minQuantity}
              max={maxQuantity}
              hasError={!isValidQuantity}
              value={selectedQuantity}
              onOdsChange={(e) => e.detail.value && setSelectedQuantity(e.detail.value)}
            />
          </div>
        </div>
        <div className="mt-10 flex items-center gap-x-4">
          <OdsButton
            label={t('managed_vcd_vdc_order_cancel_cta')}
            variant="ghost"
            onClick={() => {
              trackClick(TRACKING[orderType].orderCancel);
              navigate(backLink);
            }}
          />
          <OdsButton
            label={t('managed_vcd_vdc_order_confirm_cta')}
            isDisabled={!isValidQuantity}
            onClick={() => {
              if (!isValidQuantity) return;
              trackClick(TRACKING[orderType].orderConfirm);
              redirectToOrder();
            }}
          />
        </div>
      </div>
    </RedirectionGuard>
  );
};
