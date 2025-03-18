import {
  LinkType,
  Links,
  Clipboard,
  DashboardTile,
} from '@ovh-ux/manager-react-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { VCDDatacentre, VCDOrganization } from '@ovh-ux/manager-module-vcd-api';
import { OdsText } from '@ovhcloud/ods-components/react';
import { subRoutes } from '@/routes/routes.constant';
import { iamActions } from '@/utils/iam.constants';
import EditableTileItem from '../editable-tile-item/EditableTileItem.component';
import { capitalize } from '@/utils/capitalize';
import { ID_LABEL } from '@/pages/dashboard/dashboard.constants';
import TEST_IDS from '@/utils/testIds.constants';

type TTileProps = {
  vcdDatacentre: VCDDatacentre;
  vcdOrganization: VCDOrganization;
};

export default function DatacentreGenerationInformationTile({
  vcdDatacentre,
  vcdOrganization,
}: TTileProps) {
  const { t } = useTranslation('dashboard');
  const { t: tVdc } = useTranslation('datacentres');
  const navigate = useNavigate();

  return (
    <DashboardTile
      title={t('managed_vcd_dashboard_general_information')}
      items={[
        {
          id: 'description',
          label: t('managed_vcd_dashboard_description'),
          value: (
            <EditableTileItem
              value={vcdDatacentre?.currentState?.description}
              name="vdcDescription"
              iamActions={[
                iamActions.vmwareCloudDirectorApiovhOrganizationVirtualDataCenterEdit,
              ]}
              urn={vcdDatacentre?.iam?.urn}
              onClickEdit={() => navigate(subRoutes.editDescription)}
            />
          ),
        },
        {
          id: 'commercialRange',
          label: tVdc('managed_vcd_vdc_commercial_range'),
          value: (
            <OdsText>
              {capitalize(vcdDatacentre?.currentState?.commercialRange)}
            </OdsText>
          ),
        },
        {
          id: 'cpuCount',
          label: tVdc('managed_vcd_vdc_vcpu_count'),
          value: (
            <OdsText>
              {vcdDatacentre?.currentState.vCPUCount?.toString()}
            </OdsText>
          ),
        },
        {
          id: 'ramCount',
          label: tVdc('managed_vcd_vdc_ram_count'),
          value: (
            <OdsText>
              {tVdc('managed_vcd_vdc_quota_value', {
                quota: vcdDatacentre?.currentState?.memoryQuota,
              })}
            </OdsText>
          ),
        },
        {
          id: 'vcpuSpeed',
          label: tVdc('managed_vcd_vdc_vcpu_speed'),
          value: (
            <OdsText>
              {tVdc('managed_vcd_vdc_vcpu_value', {
                speed: vcdDatacentre?.currentState.vCPUSpeed,
              })}
            </OdsText>
          ),
        },
        {
          id: 'interface',
          label: t('managed_vcd_dashboard_management_interface'),
          value: (
            <Links
              type={LinkType.external}
              href={vcdOrganization?.currentState?.webInterfaceUrl}
              label={t('managed_vcd_dashboard_management_interface_access')}
              target="_blank"
              data-testid={TEST_IDS.dashboardDatacentreInterfaceLink}
            />
          ),
        },
        {
          id: 'apiUrl',
          label: t('managed_vcd_dashboard_api_url'),
          value: (
            <Clipboard
              value={vcdOrganization?.currentState?.apiUrl}
              className="w-full"
            />
          ),
        },
        {
          id: 'vdcId',
          label: ID_LABEL,
          value: <Clipboard value={vcdDatacentre?.id} className="w-full" />,
        },
      ]}
    />
  );
}
