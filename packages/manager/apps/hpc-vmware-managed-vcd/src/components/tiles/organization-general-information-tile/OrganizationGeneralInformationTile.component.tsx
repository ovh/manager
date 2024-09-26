import {
  Description,
  LinkType,
  Links,
  Clipboard,
  DashboardTile,
  Region,
} from '@ovh-ux/manager-react-components';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { OsdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import IVcdOrganization from '@/types/vcd-organization.interface';
import { subRoutes } from '@/routes/routes.constant';
import { EditableTileItem } from '../editable-tile-item/EditableTileItem.component';

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
            <EditableTileItem
              label={vcdOrganization?.currentState?.fullName}
              onClickEdit={() => navigate(subRoutes.editName)}
            />
          ),
        },
        {
          id: 'description',
          label: t('managed_vcd_dashboard_description'),
          value: (
            <EditableTileItem
              label={vcdOrganization?.currentState?.description}
              onClickEdit={() => navigate(subRoutes.editDescription)}
            />
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
              <Region
                name={vcdOrganization?.currentState?.region?.toLowerCase()}
                mode="region"
              />
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
              target={OdsHTMLAnchorElementTarget._blank}
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
