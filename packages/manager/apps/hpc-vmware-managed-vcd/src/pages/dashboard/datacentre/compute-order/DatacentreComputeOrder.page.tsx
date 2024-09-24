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
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  COMPUTE_ORDER_MAX_QUANTITY,
  COMPUTE_ORDER_MIN_QUANTITY,
} from './DatacentreComputeOrder.constants';
import Loading from '@/components/loading/Loading.component';
import { QuantitySelector } from '@/components/form/QuantitySelector.component';
import { subRoutes } from '@/routes/routes.constant';
import { validateComputeQuantity } from '@/utils/formValidation';
import { useVdcOrderableResource } from '@/data/hooks/useOrderableResource';
import { useVcdCatalog } from '@/data/hooks/useVcdCatalog';
import { getPricedVdcResourceList } from '@/utils/getPricedOrderableResource';
import useVcdOrder from '@/data/hooks/useVcdOrder';
import {
  useDatacentreOrderContext,
  DatacentreOrderProvider,
} from '@/context/DatacentreOrder.context';
import {
  ComputeOrderSelectCell,
  ComputeOrderVhostCell,
  ComputeOrderCpuSpeedCell,
  ComputeOrderRamCell,
  ComputeOrderCpuCountCell,
  ComputeOrderPriceCell,
} from '@/components/datagrid/compute/ComputeOrderCells.component';
import { IVdcOrderableVhostPriced } from '@/types/vcd-vdc-orderable-resource.interface';

const ComputeOrder = () => {
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

  const isValidQuantity = validateComputeQuantity(selectedQuantity);
  const orderableVhostList = getPricedVdcResourceList({
    resourceList: orderableResource?.data?.compute,
    catalog: catalog?.data,
  });

  useEffect(() => {
    if (orderableVhostList?.length && !selectedResource) {
      setSelectedResource(orderableVhostList[0].profile);
    }
  }, [selectedResource, orderableVhostList]);

  if (isLoadingResource || isLoadingCatalog) return <Loading />;
  if (isResourceError || isCatalogError || !orderableVhostList?.length) {
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

  const columns: DatagridColumn<IVdcOrderableVhostPriced>[] = [
    {
      id: 'select',
      cell: ComputeOrderSelectCell,
      label: '',
      isSortable: false,
    },
    {
      id: 'vhost',
      cell: ComputeOrderVhostCell,
      label: t('managed_vcd_vdc_order_vhost'),
      isSortable: false,
    },
    {
      id: 'cpuSpeed',
      cell: ComputeOrderCpuSpeedCell,
      label: t('managed_vcd_vdc_order_cpu_speed'),
      isSortable: false,
    },
    {
      id: 'ram',
      cell: ComputeOrderRamCell,
      label: t('managed_vcd_vdc_order_ram'),
      isSortable: false,
    },
    {
      id: 'cpuCount',
      cell: ComputeOrderCpuCountCell,
      label: t('managed_vcd_vdc_order_vcpu_count'),
      isSortable: false,
    },
    {
      id: 'price',
      cell: ComputeOrderPriceCell,
      label: t('managed_vcd_vdc_order_price'),
    },
  ];

  return (
    <div className="px-10 my-4 flex flex-col">
      <Subtitle>{t('managed_vcd_vdc_order_compute_title')}</Subtitle>
      <Description className="my-6">
        {t('managed_vcd_vdc_order_compute_subtitle')}
      </Description>
      <Datagrid
        columns={columns}
        items={orderableVhostList}
        totalItems={orderableVhostList.length}
      />
      <div className="mt-10">
        <QuantitySelector
          quantity={selectedQuantity}
          setQuantity={setSelectedQuantity}
          isValid={isValidQuantity}
          title={t('managed_vcd_vdc_order_quantity_title')}
          label={t('managed_vcd_vdc_order_quantity_label')}
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

export default function ComputeOrderPage() {
  return (
    <DatacentreOrderProvider>
      <ComputeOrder />
    </DatacentreOrderProvider>
  );
}
