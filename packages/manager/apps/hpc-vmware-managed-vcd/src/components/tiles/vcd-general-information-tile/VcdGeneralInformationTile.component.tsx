import {
  CommonTitle,
  Description,
  LinkType,
  Links,
} from '@ovhcloud/manager-components';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import {
  OsdsClipboard,
  OsdsDivider,
  OsdsIcon,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import IVcdOrganization from '@/types/vcd-organization.interface';
import RegionLabel from '../../region-label/RegionLabel.component';
import TileSubtitle from '../tile-subtitle/TileSubtitle.component';

type TTileProps = {
  vcdOrganisation?: IVcdOrganization;
};

// TODO remove when Clipboard is available in manager-components
const Clipboard = ({ value }: { value: string }) => {
  return (
    <OsdsClipboard className="mb-2" value={value}>
      <span slot="success-message">
        <OsdsText color={ODS_THEME_COLOR_INTENT.success}>Copied !</OsdsText>
      </span>
      <span slot="error-message">
        <OsdsText color={ODS_THEME_COLOR_INTENT.error}>Error</OsdsText>
      </span>
    </OsdsClipboard>
  );
};

export default function VcdGenerationInformationTile({
  vcdOrganisation,
}: TTileProps) {
  const { t } = useTranslation('dashboard');

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
              {vcdOrganisation?.currentState?.description}
            </Description>
            <OsdsIcon
              aria-label="edit"
              className="mx-6 cursor-pointer"
              onClick={() => {}}
              name={ODS_ICON_NAME.PEN}
              size={ODS_ICON_SIZE.xxs}
              color={ODS_THEME_COLOR_INTENT.primary}
            />
          </div>
          <OsdsDivider separator />
          <TileSubtitle>
            {t('managed_vcd_dashboard_commercial_name')}
          </TileSubtitle>
          <Description>{vcdOrganisation?.currentState?.fullName}</Description>
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
              code={vcdOrganisation?.currentState?.region}
            ></RegionLabel>
          </OsdsText>
          <OsdsDivider separator />
          <TileSubtitle>
            {t('managed_vcd_dashboard_datacentres_count')}
          </TileSubtitle>
          <Description>?</Description>
          <OsdsDivider separator />
          <TileSubtitle>
            {t('managed_vcd_dashboard_management_interface')}
          </TileSubtitle>
          <Links
            type={LinkType.external}
            href={vcdOrganisation?.currentState?.webInterfaceUrl}
            label={t('managed_vcd_dashboard_management_interface_access')}
          />
          <OsdsDivider separator />
          <TileSubtitle>{t('managed_vcd_dashboard_api_url')}</TileSubtitle>
          <Clipboard value={vcdOrganisation?.currentState?.apiUrl} />
        </div>
      </div>
    </OsdsTile>
  );
}
