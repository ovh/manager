import {
  CommonTitle,
  Description,
  LinkType,
  Links,
  Clipboard,
} from '@ovhcloud/manager-components';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import {
  OsdsDivider,
  OsdsIcon,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import IVcdOrganization from '@/types/vcd-organization.interface';
import TileSubtitle from '@/components/tiles/tile-subtitle/TileSubtitle.component';
import RegionLabel from '@/components/region-label/RegionLabel.component';
import { urlParts } from '@/routes/routes.constant';

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
    <OsdsTile className="w-full h-full flex-col" inline rounded>
      <div className="flex flex-col w-full">
        <CommonTitle>
          {t('managed_vcd_dashboard_general_information')}
        </CommonTitle>
        <OsdsDivider separator />
        <TileSubtitle>{t('managed_vcd_dashboard_name')}</TileSubtitle>
        <div className="flex flex-row justify-between items-center">
          <Description>{vcdOrganization?.currentState?.fullName}</Description>
          <OsdsIcon
            aria-label="edit"
            className="mx-6 cursor-pointer"
            name={ODS_ICON_NAME.PEN}
            size={ODS_ICON_SIZE.xxs}
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={() => navigate(urlParts.editName)}
          />
        </div>
        <OsdsDivider separator />
        <div className="flex flex-col mb-3">
          <TileSubtitle>{t('managed_vcd_dashboard_description')}</TileSubtitle>
          <div className="flex flex-row justify-between items-center">
            <Description>
              {vcdOrganization?.currentState?.description}
            </Description>
            <OsdsIcon
              aria-label="edit"
              className="mx-6 cursor-pointer"
              name={ODS_ICON_NAME.PEN}
              size={ODS_ICON_SIZE.xxs}
              color={ODS_THEME_COLOR_INTENT.primary}
              onClick={() => navigate(urlParts.editDescription)}
            />
          </div>
          <OsdsDivider separator />
          <TileSubtitle>{t('managed_vcd_dashboard_localisation')}</TileSubtitle>
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
          <OsdsDivider separator />
          <TileSubtitle>
            {t('managed_vcd_dashboard_datacentres_count')}
          </TileSubtitle>
          <Description>{datacenterCount.toString()}</Description>
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
          <Clipboard value={vcdOrganization.currentState?.apiUrl} />
        </div>
      </div>
    </OsdsTile>
  );
}
