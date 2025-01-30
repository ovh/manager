import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OsdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  getVcdDatacentreStorageRoute,
  getVdcStorageQueryKey,
} from '@ovh-ux/manager-module-vcd-api';
import DatagridContainer from '@/components/datagrid/container/DatagridContainer.component';
import { STORAGE_LABEL } from '../datacentreDashboard.constants';
import { subRoutes, urls } from '@/routes/routes.constant';
import { ID_LABEL } from '../../dashboard.constants';
import { ActionDeleteCell } from '@/components/datagrid/compute/ComputeCells.component';
import {
  DatagridBillingCell,
  DatagridCapacityCell,
  DatagridIdCell,
  DatagridNameCell,
  DatagridProfileCell,
  DatagridTypeCell,
} from '@/components/datagrid/storage/StorageCells.component';

export default function StorageListingPage() {
  const { id, vdcId } = useParams();
  const { t } = useTranslation('datacentres/storage');
  const { t: tCompute } = useTranslation('datacentres/compute');
  const navigate = useNavigate();

  const columns = [
    {
      id: 'id',
      cell: DatagridIdCell,
      label: ID_LABEL,
      isSortable: false,
    },
    {
      id: 'name',
      cell: DatagridNameCell,
      label: t('managed_vcd_vdc_storage_name'),
      isSortable: false,
    },
    {
      id: 'profile',
      cell: DatagridProfileCell,
      label: t('managed_vcd_vdc_storage_profile'),
      isSortable: false,
    },
    {
      id: 'type',
      cell: DatagridTypeCell,
      label: t('managed_vcd_vdc_storage_type'),
      isSortable: false,
    },
    {
      id: 'capacity',
      cell: DatagridCapacityCell,
      label: t('managed_vcd_vdc_storage_capacity'),
      isSortable: false,
    },
    {
      id: 'billing',
      cell: DatagridBillingCell,
      label: tCompute('managed_vcd_vdc_compute_billing'),
      isSortable: false,
    },
    {
      id: 'actions',
      cell: ActionDeleteCell,
      isSortable: false,
    },
  ];

  return (
    <DatagridContainer
      title={STORAGE_LABEL}
      queryKey={getVdcStorageQueryKey(vdcId)}
      columns={columns}
      route={{
        api: getVcdDatacentreStorageRoute(id, vdcId),
        onboarding: urls.datacentreStorageOrder
          .replace(subRoutes.dashboard, id)
          .replace(subRoutes.vdcId, vdcId),
      }}
      isEmbedded
      orderButton={
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => navigate(subRoutes.order)}
        >
          {t('managed_vcd_vdc_storage_order_cta')}
        </OsdsButton>
      }
    />
  );
}
