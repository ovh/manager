import {
  getVcdDatacentreComputeRoute,
  getVdcComputeQueryKey,
  isStatusTerminated,
  useVcdDatacentre,
} from '@ovh-ux/manager-module-vcd-api';
import {
  DatagridColumn,
  useFeatureAvailability,
} from '@ovh-ux/manager-react-components';
import { OdsButton, OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { ID_LABEL } from '../../dashboard.constants';
import { VHOST_LABEL, VHOSTS_LABEL } from './datacentreCompute.constants';
import {
  ActionDeleteCell,
  DatagridBillingCell,
  DatagridCpuCountCell,
  DatagridIdCell,
  DatagridRamCountCell,
  DatagridVHostProfilCell,
} from '@/components/datagrid/compute/ComputeCells.component';
import DatagridContainer from '@/components/datagrid/container/DatagridContainer.component';
import { subRoutes, urls } from '@/routes/routes.constant';
import { FEATURES } from '@/utils/features.constants';
import TEST_IDS from '@/utils/testIds.constants';
import { TRACKING } from '@/tracking.constants';
import { VMWARE_CLOUD_DIRECTOR_LABEL } from '@/utils/label.constants';

export default function ComputeListingPage() {
  const { id, vdcId } = useParams();
  const { t } = useTranslation('datacentres/compute');
  const { t: tVdc } = useTranslation('datacentres');
  const navigate = useNavigate();
  const { data: features } = useFeatureAvailability([
    FEATURES.COMPUTE_SPECIAL_OFFER_BANNER,
  ]);
  const { trackClick } = useOvhTracking();
  const { data: vcdDatacentre } = useVcdDatacentre(id, vdcId);

  const columns = [
    {
      id: 'id',
      cell: DatagridIdCell,
      label: ID_LABEL,
      isSortable: false,
    },
    {
      id: 'vHostProfile',
      cell: DatagridVHostProfilCell,
      label: VHOST_LABEL,
      isSortable: false,
    },
    {
      id: 'cpuCount',
      cell: DatagridCpuCountCell,
      label: tVdc('managed_vcd_vdc_vcpu_count'),
      isSortable: false,
    },
    {
      id: 'ramCount',
      cell: DatagridRamCountCell,
      label: tVdc('managed_vcd_vdc_ram_count'),
      isSortable: false,
    },
    {
      id: 'billing',
      cell: DatagridBillingCell,
      label: t('managed_vcd_vdc_compute_billing'),
      isSortable: false,
    },
    {
      id: 'actions',
      cell: ActionDeleteCell,
      isSortable: false,
    },
  ] as DatagridColumn<unknown>[];

  return (
    <>
      {features?.[FEATURES.COMPUTE_SPECIAL_OFFER_BANNER] && (
        <div className="mx-10 pb-4">
          <OdsMessage
            color="information"
            data-testid={TEST_IDS.computeSpecialOfferBanner}
            isDismissible={false}
          >
            <OdsText>
              {t('managed_vcd_vdc_compute_special_offer', {
                productName: VMWARE_CLOUD_DIRECTOR_LABEL,
              })}
            </OdsText>
          </OdsMessage>
        </div>
      )}
      <DatagridContainer
        title={VHOSTS_LABEL}
        queryKey={getVdcComputeQueryKey(vdcId)}
        columns={columns}
        route={{
          api: getVcdDatacentreComputeRoute(id, vdcId),
          onboarding: urls.datacentreComputeOrder
            .replace(subRoutes.dashboard, id)
            .replace(subRoutes.vdcId, vdcId),
        }}
        shouldFetchAll
        isEmbedded
        orderButton={
          <OdsButton
            label={t('managed_vcd_vdc_compute_order_cta')}
            variant="outline"
            isDisabled={isStatusTerminated(vcdDatacentre?.data?.resourceStatus)}
            onClick={() => {
              trackClick(TRACKING.compute.addVirtualHost);
              navigate(subRoutes.order);
            }}
            data-testid={TEST_IDS.computeOrderCta}
          />
        }
      />
    </>
  );
}
