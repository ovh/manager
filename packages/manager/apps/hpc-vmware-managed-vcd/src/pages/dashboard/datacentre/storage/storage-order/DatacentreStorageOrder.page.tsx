import {
  Subtitle,
  Description,
  ErrorBanner,
  Datagrid,
  DatagridColumn,
} from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { OsdsButton } from '@ovhcloud/ods-components/react';
import { subRoutes } from '@/routes/routes.constant';
import { QuantitySelector } from '@/components/form/QuantitySelector.component';
import {
  STORAGE_ORDER_MAX_QUANTITY,
  STORAGE_ORDER_MIN_QUANTITY,
} from './DatacentreStorageOrder.constants';
import {
  DatacentreOrderProvider,
  useDatacentreOrderContext,
} from '@/context/DatacentreOrder.context';
import { useVdcOrderableResource } from '@/data/hooks/useOrderableResource';
import { useVcdCatalog } from '@/data/hooks/useVcdCatalog';
import useVcdOrder from '@/data/hooks/useVcdOrder';
import { validateStorageQuantity } from '@/utils/formValidation';
import Loading from '@/components/loading/Loading.component';
import { getPricedVdcResourceList } from '@/utils/getPricedOrderableResource';
import { IVdcOrderableStoragePriced } from '@/types/vcd-vdc-orderable-resource.interface';
import {
  StorageOrderPriceCell,
  StorageOrderSelectCell,
  StorageOrderTypeCell,
} from '@/components/datagrid/storage/StorageOrderCells.component';

const StorageOrder = () => {
  const { t } = useTranslation('hpc-vmware-managed-vcd/datacentres/order');
  const { id, vdcId } = useParams();
  const navigate = useNavigate();
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
  });

  const isValidQuantity = validateStorageQuantity(selectedQuantity);
  const orderableStorageList = getPricedVdcResourceList({
    resourceList: orderableResource?.data?.storage,
    catalog: catalog?.data,
  });

  useEffect(() => {
    if (orderableStorageList?.length && !selectedResource) {
      setSelectedResource(orderableStorageList[0].profile);
    }
  }, [selectedResource, orderableStorageList]);

  if (isLoadingResource || isLoadingCatalog) return <Loading />;
  if (isResourceError || isCatalogError || !orderableStorageList?.length) {
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

  const columns: DatagridColumn<IVdcOrderableStoragePriced>[] = [
    {
      id: 'select',
      cell: StorageOrderSelectCell,
      label: '',
      isSortable: false,
    },
    {
      id: 'storage',
      cell: StorageOrderTypeCell,
      label: t('managed_vcd_vdc_order_type'),
      isSortable: false,
    },
    {
      id: 'price',
      cell: StorageOrderPriceCell,
      label: t('managed_vcd_vdc_order_price'),
      isSortable: false,
    },
  ];

  return (
    <div className="px-10 my-4 flex flex-col">
      <Subtitle>{t('managed_vcd_vdc_order_storage_title')}</Subtitle>
      <Description className="my-6">
        {t('managed_vcd_vdc_order_storage_subtitle')}
      </Description>
      <Datagrid
        columns={columns}
        items={orderableStorageList}
        totalItems={orderableStorageList.length}
      />
      <div className="mt-10">
        <QuantitySelector
          quantity={selectedQuantity}
          setQuantity={setSelectedQuantity}
          isValid={isValidQuantity}
          title={t('managed_vcd_vdc_order_quantity_title')}
          label={t('managed_vcd_vdc_order_quantity_label')}
          min={STORAGE_ORDER_MIN_QUANTITY}
          max={STORAGE_ORDER_MAX_QUANTITY}
        />
      </div>
      <div className="flex items-center gap-x-4 mt-10">
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.ghost}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => navigate(`../${subRoutes.datacentreStorage}`)}
        >
          {t('managed_vcd_vdc_order_cancel_cta')}
        </OsdsButton>
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.flat}
          color={ODS_THEME_COLOR_INTENT.primary}
          disabled={!isValidQuantity ? true : undefined}
          onClick={isValidQuantity ? redirectToOrder : null}
        >
          {t('managed_vcd_vdc_order_confirm_cta')}
        </OsdsButton>
      </div>
    </div>
  );
};

export default function StorageOrderPage() {
  return (
    <DatacentreOrderProvider>
      <StorageOrder />
    </DatacentreOrderProvider>
  );
}
