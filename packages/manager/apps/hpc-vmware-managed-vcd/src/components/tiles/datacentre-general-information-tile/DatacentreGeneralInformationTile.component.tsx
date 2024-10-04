import {
  Description,
  LinkType,
  Links,
  Clipboard,
  DashboardTile,
} from '@ovh-ux/manager-react-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import IVcdDatacentre from '@/types/vcd-datacenter.interface';
import IVcdOrganization from '@/types/vcd-organization.interface';
import { subRoutes } from '@/routes/routes.constant';
import { iamActions } from '@/utils/iam.constants';
import EditableTileItem from '../editable-tile-item/EditableTileItem.component';

type TTileProps = {
  vcdDatacentre: IVcdDatacentre;
  vcdOrganization: IVcdOrganization;
};

export default function DatacentreGenerationInformationTile({
  vcdDatacentre,
  vcdOrganization,
}: TTileProps) {
  const { t } = useTranslation('dashboard');
  const { t: tVdc } = useTranslation('hpc-vmware-managed-vcd/datacentres');
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
              label={vcdDatacentre?.currentState?.description}
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
            <Description>
              {vcdDatacentre?.currentState?.commercialRange}
            </Description>
          ),
        },
        {
          id: 'cpuCount',
          label: tVdc('managed_vcd_vdc_vcpu_count'),
          value: (
            <Description>
              {vcdDatacentre?.currentState?.vCPUCount?.toString()}
            </Description>
          ),
        },
        {
          id: 'ramCount',
          label: tVdc('managed_vcd_vdc_ram_count'),
          value: (
            <Description>
              {tVdc('managed_vcd_vdc_quota_value', {
                quota: vcdDatacentre?.currentState?.memoryQuota,
              })}
            </Description>
          ),
        },
        {
          id: 'vcpuSpeed',
          label: tVdc('managed_vcd_vdc_vcpu_speed'),
          value: (
            <Description>
              {tVdc('managed_vcd_vdc_vcpu_value', {
                speed: vcdDatacentre?.currentState?.vCPUSpeed,
              })}
            </Description>
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
              target={OdsHTMLAnchorElementTarget._blank}
            />
          ),
        },
        {
          id: 'apiUrl',
          label: t('managed_vcd_dashboard_api_url'),
          value: <Clipboard value={vcdOrganization?.currentState?.apiUrl} />,
        },
        {
          id: 'vdcId',
          label: tVdc('managed_vcd_vdc_id'),
          value: <Clipboard value={vcdDatacentre?.id} />,
        },
      ]}
    />
  );
}
