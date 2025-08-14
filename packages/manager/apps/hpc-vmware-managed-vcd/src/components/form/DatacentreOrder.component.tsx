import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Datagrid,
  DatagridColumn,
  ErrorBanner,
  RedirectionGuard,
} from '@ovh-ux/manager-react-components';
import {
  OdsButton,
  OdsQuantity,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  isStatusTerminated,
  useVcdCatalog,
  useVcdDatacentre,
  useVcdOrder,
  useVdcOrderableResource,
  VCDOrderableStoragePriced,
  VCDOrderableVhostPriced,
} from '@ovh-ux/manager-module-vcd-api';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useDatacentreOrderContext } from '@/context/DatacentreOrder.context';
import { validateQuantity } from '@/utils/formValidation';
import { getPricedVdcResources } from '@/utils/getPricedOrderableResource';
import Loading from '../loading/Loading.component';
import { TRACKING } from '@/tracking.constants';

type OrderType = 'compute' | 'storage';
type OrderColumns<T extends OrderType> = T extends 'compute'
  ? DatagridColumn<VCDOrderableVhostPriced>[]
  : DatagridColumn<VCDOrderableStoragePriced>[];

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
  const { id, vdcId } = useParams();
  const { trackClick } = useOvhTracking();
  const { data: vcdDatacentre } = useVcdDatacentre(id, vdcId);
  const {
    selectedResource,
    setSelectedResource,
    selectedQuantity,
    setSelectedQuantity,
  } = useDatacentreOrderContext();
  const {
    data: orderableResource,
    isLoading: isLoadingResource,
    isError: isResourceError,
  } = useVdcOrderableResource(id, vdcId);
  const {
    data: catalog,
    isLoading: isLoadingCatalog,
    isError: isCatalogError,
  } = useVcdCatalog(id);
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
  const pricedResources = getPricedVdcResources({
    catalog: catalog?.data,
    resources:
      orderType === 'compute'
        ? orderableResource?.data?.compute
        : orderableResource?.data?.storage,
  });

  useEffect(() => {
    if (pricedResources?.length && !selectedResource) {
      setSelectedResource(pricedResources[0].profile);
    }
  }, [selectedResource, pricedResources]);

  if (isLoadingResource || isLoadingCatalog) return <Loading />;
  if (isResourceError || isCatalogError || !pricedResources?.length) {
    return (
      <ErrorBanner
        error={{
          status: 500,
          data: {
            message: t('managed_vcd_vdc_order_unavailable'),
          },
        }}
      />
    );
  }

  return (
    <RedirectionGuard
      isLoading={isLoadingResource || isLoadingCatalog}
      condition={isStatusTerminated(vcdDatacentre?.data?.resourceStatus)}
      route={'..'}
    >
      <div className="px-10 my-4 flex flex-col">
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
          <OdsText preset="heading-3">
            {t('managed_vcd_vdc_order_quantity_title')}
          </OdsText>
          <div className="flex flex-col items-start">
            <OdsText class="my-2">
              {t('managed_vcd_vdc_order_quantity_label')}
            </OdsText>
            <OdsQuantity
              name="order-quantity"
              min={minQuantity}
              max={maxQuantity}
              hasError={!isValidQuantity}
              value={selectedQuantity}
              onOdsChange={(e) => setSelectedQuantity(e.detail.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-x-4 mt-10">
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
