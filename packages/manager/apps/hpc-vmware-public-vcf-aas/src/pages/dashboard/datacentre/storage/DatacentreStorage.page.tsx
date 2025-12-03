import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { OdsButton } from '@ovhcloud/ods-components/react';

import {
  getVcdDatacentreStorageRoute,
  getVdcStorageQueryKey,
  isStatusTerminated,
  useVcdDatacentre,
} from '@ovh-ux/manager-module-vcd-api';
import { DatagridColumn } from '@ovh-ux/manager-react-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { ActionDeleteCell } from '@/components/datagrid/compute/ComputeCells.component';
import DatagridContainer from '@/components/datagrid/container/DatagridContainer.component';
import {
  DatagridBillingCell,
  DatagridCapacityCell,
  DatagridIdCell,
  DatagridNameCell,
  DatagridProfileCell,
  DatagridTypeCell,
} from '@/components/datagrid/storage/StorageCells.component';
import { useDatacentreParams } from '@/hooks/params/useSafeParams';
import { subRoutes, urls } from '@/routes/routes.constant';
import { TRACKING } from '@/tracking.constants';
import TEST_IDS from '@/utils/testIds.constants';

import { ID_LABEL } from '../../dashboard.constants';
import { STORAGE_LABEL } from '../datacentreDashboard.constants';

export default function StorageListingPage() {
  const { id, vdcId } = useDatacentreParams();
  const { t } = useTranslation('datacentres/storage');
  const { t: tCompute } = useTranslation('datacentres/compute');
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const { data: vcdDatacentre } = useVcdDatacentre(id, vdcId);
  const isServiceTerminated: boolean = vcdDatacentre?.data.resourceStatus
    ? isStatusTerminated(vcdDatacentre?.data?.resourceStatus)
    : false;

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
  ] as DatagridColumn<unknown>[];

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
      shouldFetchAll
      isEmbedded
      orderButton={
        <OdsButton
          label={t('managed_vcd_vdc_storage_order_cta')}
          variant="outline"
          isDisabled={isServiceTerminated}
          onClick={() => {
            trackClick(TRACKING.storage.addStorage);
            navigate(subRoutes.datacentreStorageOrder);
          }}
          data-testid={TEST_IDS.storageOrderCta}
        />
      }
    />
  );
}
