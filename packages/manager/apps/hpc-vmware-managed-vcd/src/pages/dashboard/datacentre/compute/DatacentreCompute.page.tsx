import {
  getVcdDatacentreComputeRoute,
  getVdcComputeQueryKey,
} from '@ovh-ux/manager-module-vcd-api';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsMessage,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
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

export default function ComputeListingPage() {
  const { id, vdcId } = useParams();
  const { t } = useTranslation('datacentres/compute');
  const { t: tVdc } = useTranslation('datacentres');
  const navigate = useNavigate();
  const { data: features } = useFeatureAvailability([
    FEATURES.COMPUTE_SPECIAL_OFFER_BANNER,
  ]);

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
  ];

  return (
    <>
      {features?.[FEATURES.COMPUTE_SPECIAL_OFFER_BANNER] && (
        <div className="mx-10 pb-4">
          <OsdsMessage type={ODS_MESSAGE_TYPE.info}>
            <OsdsText
              size={ODS_TEXT_SIZE._400}
              level={ODS_TEXT_LEVEL.body}
              color={ODS_THEME_COLOR_INTENT.info}
            >
              {t('managed_vcd_vdc_compute_special_offer')}
            </OsdsText>
          </OsdsMessage>
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
        isEmbedded
        orderButton={
          <OsdsButton
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.stroked}
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={() => navigate(subRoutes.order)}
          >
            {t('managed_vcd_vdc_compute_order_cta')}
          </OsdsButton>
        }
      />
    </>
  );
}
