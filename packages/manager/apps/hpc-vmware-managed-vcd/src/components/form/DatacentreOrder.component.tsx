import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Datagrid,
  DatagridColumn,
  Description,
  ErrorBanner,
  Subtitle,
} from '@ovh-ux/manager-react-components';
import { OsdsButton } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { QuantitySelector } from './QuantitySelector.component';
import { useDatacentreOrderContext } from '@/context/DatacentreOrder.context';
import { useVdcOrderableResource } from '@/data/hooks/useOrderableResource';
import { useVcdCatalog } from '@/data/hooks/useVcdCatalog';
import useVcdOrder from '@/data/hooks/useVcdOrder';
import { validateQuantity } from '@/utils/formValidation';
import { getPricedVdcResources } from '@/utils/getPricedOrderableResource';
import Loading from '../loading/Loading.component';
import {
  IVdcOrderableStoragePriced,
  IVdcOrderableVhostPriced,
} from '@/types/vcd-vdc-orderable-resource.interface';

type OrderType = 'compute' | 'storage';
type OrderColumns<T extends OrderType> = T extends 'compute'
  ? DatagridColumn<IVdcOrderableVhostPriced>[]
  : DatagridColumn<IVdcOrderableStoragePriced>[];

interface DatacentreOrderProps<T extends OrderType> {
  orderType: T;
  columns: OrderColumns<T>;
  title: string;
  subtitle: string;
  backLink: string;
  minQuantity?: number;
  maxQuantity?: number;
}

export const DatacentreOrder = <T extends OrderType>({
  orderType,
  columns,
  title,
  subtitle,
  backLink,
  minQuantity = 1,
  maxQuantity = 100,
}: DatacentreOrderProps<T>) => {
  const { t } = useTranslation('hpc-vmware-managed-vcd/datacentres/order');
  const navigate = useNavigate();
  const { id, vdcId } = useParams();
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
    <React.Suspense>
      <div className="px-10 my-4 flex flex-col">
        <Subtitle>{title}</Subtitle>
        <Description className="my-6">{subtitle}</Description>
        <Datagrid
          columns={columns}
          items={pricedResources}
          totalItems={pricedResources.length}
          contentAlignLeft
        />
        <div className="mt-10">
          <QuantitySelector
            quantity={selectedQuantity}
            setQuantity={setSelectedQuantity}
            isValid={isValidQuantity}
            title={t('managed_vcd_vdc_order_quantity_title')}
            label={t('managed_vcd_vdc_order_quantity_label')}
            min={minQuantity}
            max={maxQuantity}
          />
        </div>
        <div className="flex items-center gap-x-4 mt-10">
          <OsdsButton
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.ghost}
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={() => navigate(backLink)}
          >
            {t('managed_vcd_vdc_order_cancel_cta')}
          </OsdsButton>
          <OsdsButton
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.flat}
            color={ODS_THEME_COLOR_INTENT.primary}
            disabled={!isValidQuantity || undefined}
            onClick={isValidQuantity ? redirectToOrder : null}
          >
            {t('managed_vcd_vdc_order_confirm_cta')}
          </OsdsButton>
        </div>
      </div>
    </React.Suspense>
  );
};
