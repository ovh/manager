import {
  CommonTitle,
  Description,
  LinkType,
  Links,
  Clipboard,
} from '@ovhcloud/manager-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import {
  OsdsDivider,
  OsdsIcon,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import IVcdDatacentre from '@/types/vcd-datacenter.interface';
import TileSubtitle from '@/components/tiles/tile-subtitle/TileSubtitle.component';
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
    <OsdsTile className="w-full h-full flex-col" inline rounded>
      <div className="flex flex-col w-full">
        <CommonTitle>
          {t('managed_vcd_dashboard_general_information')}
        </CommonTitle>
        <OsdsDivider separator />
        <div className="flex flex-col mb-3">
          <TileSubtitle>{t('managed_vcd_dashboard_description')}</TileSubtitle>
          <div className="flex flex-row justify-between items-center">
            <Description>
              {vcdDatacentre?.currentState?.description}
            </Description>
            <OsdsIcon
              aria-label="edit"
              className="mx-6 cursor-pointer"
              onClick={() => navigate(subRoutes.editDescription)}
              name={ODS_ICON_NAME.PEN}
              size={ODS_ICON_SIZE.xxs}
              color={ODS_THEME_COLOR_INTENT.primary}
            />
          </div>
          <OsdsDivider separator />
          <TileSubtitle>
            {tVdc('managed_vcd_vdc_commercial_range')}
          </TileSubtitle>
          <Description>
            {vcdDatacentre?.currentState?.commercialRange}
          </Description>
          <OsdsDivider separator />
          <TileSubtitle>{tVdc('managed_vcd_vdc_cpu_count')}</TileSubtitle>
          <Description>
            {vcdDatacentre?.currentState?.vCPUCount?.toString()}
          </Description>
          <OsdsDivider separator />
          <TileSubtitle>{tVdc('managed_vcd_vdc_ram_count')}</TileSubtitle>
          <Description>
            {tVdc('managed_vcd_vdc_quota_value', {
              quota: vcdDatacentre?.currentState?.memoryQuota,
            })}
          </Description>
          <OsdsDivider separator />
          <TileSubtitle>
            {tVdc('managed_vcd_vdc_disk_space_count')}
          </TileSubtitle>
          <Description>
            {tVdc('managed_vcd_vdc_quota_value', {
              quota: vcdDatacentre?.currentState?.storageQuota,
            })}
          </Description>
          <OsdsDivider separator />
          <TileSubtitle>{tVdc('managed_vcd_vdc_vcpu_speed')}</TileSubtitle>
          <Description>
            {tVdc('managed_vcd_vdc_vcpu_value', {
              speed: vcdDatacentre?.currentState?.vCPUSpeed,
            })}
          </Description>
          <OsdsDivider separator />
          <TileSubtitle>
            {t('managed_vcd_dashboard_management_interface')}
          </TileSubtitle>
          <Links
            type={LinkType.external}
            href={vcdOrganization?.currentState?.webInterfaceUrl}
            label={t('managed_vcd_dashboard_management_interface_access')}
          />
          <OsdsDivider separator />
          <TileSubtitle>{t('managed_vcd_dashboard_api_url')}</TileSubtitle>
          <Clipboard value={vcdOrganization?.currentState?.apiUrl} />
          <OsdsDivider separator />
          <TileSubtitle>{tVdc('managed_vcd_vdc_id')}</TileSubtitle>
          <Clipboard value={vcdDatacentre?.id} />
        </div>
      </div>
    </OsdsTile>
  );
}
