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
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import IVcdDatacentre from '@/types/vcd-datacenter.interface';
import IVcdOrganization from '@/types/vcd-organization.interface';
import { subRoutes } from '@/routes/routes.constant';

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
            <div className="flex justify-between items-center">
              <Description>
                {vcdDatacentre?.currentState?.description}
              </Description>
              <OsdsIcon
                aria-label="edit"
                className="mx-6 cursor-pointer"
                name={ODS_ICON_NAME.PEN}
                size={ODS_ICON_SIZE.xxs}
                color={ODS_THEME_COLOR_INTENT.primary}
                onClick={() => navigate(subRoutes.editDescription)}
              />
            </div>
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
          id: 'diskSpace',
          label: tVdc('managed_vcd_vdc_disk_space_count'),
          value: (
            <Description>
              {tVdc('managed_vcd_vdc_quota_value', {
                quota: vcdDatacentre?.currentState?.storageQuota,
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
            />
          ),
        },
        {
          id: 'apiUrl',
          label: t('managed_vcd_dashboard_api_url'),
          value: (
            <Clipboard
              value={vcdOrganization?.currentState?.apiUrl}
              data-testid="clipboard-vdc-apiUrl"
            />
          ),
        },
        {
          id: 'vdcId',
          label: tVdc('managed_vcd_vdc_id'),
          value: (
            <Clipboard
              value={vcdDatacentre?.id}
              data-testid="clipboard-vdc-Id"
            />
          ),
        },
      ]}
    />
  );
}
