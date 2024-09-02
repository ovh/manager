import {
  Description,
  LinkType,
  Links,
  Clipboard,
  DashboardTile,
} from '@ovhcloud/manager-components';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { OsdsIcon, OsdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import IVcdOrganization from '@/types/vcd-organization.interface';
import RegionLabel from '@/components/region-label/RegionLabel.component';
import { subRoutes } from '@/routes/routes.constant';

type TTileProps = {
  vcdOrganization: IVcdOrganization;
  datacenterCount?: number;
};

export default function OrganizationGenerationInformationTile({
  vcdOrganization,
  datacenterCount = 0,
}: TTileProps) {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();

  return (
    <DashboardTile
      title={t('managed_vcd_dashboard_general_information')}
      items={[
        {
          id: 'name',
          label: t('managed_vcd_dashboard_name'),
          value: (
            <div className="flex justify-between items-center">
              <Description>
                {vcdOrganization?.currentState?.fullName}
              </Description>
              <OsdsIcon
                aria-label="edit"
                className="mx-6 cursor-pointer"
                name={ODS_ICON_NAME.PEN}
                size={ODS_ICON_SIZE.xxs}
                color={ODS_THEME_COLOR_INTENT.primary}
                onClick={() => navigate(subRoutes.editName)}
              />
            </div>
          ),
        },
        {
          id: 'description',
          label: t('managed_vcd_dashboard_description'),
          value: (
            <div className="flex justify-between items-center">
              <Description>
                {vcdOrganization?.currentState?.description}
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
          id: 'location',
          label: t('managed_vcd_dashboard_localisation'),
          value: (
            <OsdsText
              className="mb-4"
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
              hue={ODS_THEME_COLOR_HUE._500}
            >
              <RegionLabel
                code={vcdOrganization?.currentState?.region}
              ></RegionLabel>
            </OsdsText>
          ),
        },
        {
          id: 'datacentresCount',
          label: t('managed_vcd_dashboard_datacentres_count'),
          value: <Description>{datacenterCount.toString()}</Description>,
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
          value: <Clipboard value={vcdOrganization.currentState?.apiUrl} />,
        },
      ]}
    />
  );
}
