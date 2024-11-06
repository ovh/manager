import React from 'react';
import {
  Clipboard,
  Region,
  ServiceDetails,
} from '@ovh-ux/manager-react-components';
import {
  OsdsButton,
  OsdsIcon,
  OsdsLink,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_LINK_REFERRER_POLICY,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';
import { OKMS } from '@/types/okms.type';
import { Tile } from '@/components/dashboard/tile/tile.component';
import { TileSeparator } from '@/components/dashboard/tile-separator/tileSeparator';
import { TileValue } from '@/components/dashboard/tile-value/tileValue.component';
import { TileItem } from '@/components/dashboard/tile-item/tileItem.component';

type InformationTileProps = {
  okmsData?: OKMS;
  okmsServiceInfos?: ServiceDetails;
};

const InformationsTile = ({
  okmsData,
  okmsServiceInfos,
}: InformationTileProps) => {
  const { t } = useTranslation('key-management-service/dashboard');
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();

  return (
    <Tile title={t('general_informations')}>
      <TileSeparator />
      <TileItem title={t('key_management_service_dashboard_field_label_name')}>
        <div className="flex justify-between items-center">
          <TileValue value={okmsServiceInfos?.resource.displayName} />
          <OsdsButton
            circle
            variant={ODS_BUTTON_VARIANT.stroked}
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={() => navigate('update-name')}
          >
            <OsdsIcon
              aria-label="edit"
              name={ODS_ICON_NAME.PEN}
              size={ODS_ICON_SIZE.xs}
              color={ODS_THEME_COLOR_INTENT.primary}
            />
          </OsdsButton>
        </div>
      </TileItem>
      <TileSeparator />
      <TileItem title={t('key_management_service_dashboard_field_label_id')}>
        <Clipboard value={okmsData?.id} />
      </TileItem>
      <TileSeparator />
      <TileItem title={t('key_management_service_dashboard_field_label_urn')}>
        <Clipboard value={okmsData?.iam.urn} />
      </TileItem>
      <TileSeparator />
      <TileItem
        title={t('key_management_service_dashboard_field_label_region')}
      >
        <OsdsText
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.default}
        >
          <Region
            mode={'region'}
            name={okmsData.region.toLowerCase().replaceAll('_', '-')}
          />
        </OsdsText>
      </TileItem>
      <TileSeparator />
      <TileItem
        title={t('key_management_service_dashboard_field_label_restApi')}
      >
        <Clipboard value={okmsData?.restEndpoint} />
      </TileItem>
      <TileSeparator />
      <TileItem title={t('key_management_service_dashboard_field_label_kmip')}>
        <Clipboard value={okmsData?.kmipEndpoint} />
      </TileItem>
      <TileSeparator />
      <TileItem
        title={t('key_management_service_dashboard_field_label_swagger')}
      >
        <OsdsLink
          href={okmsData?.swaggerEndpoint}
          color={ODS_THEME_COLOR_INTENT.primary}
          target={OdsHTMLAnchorElementTarget._blank}
          referrerpolicy={ODS_LINK_REFERRER_POLICY.strictOriginWhenCrossOrigin}
          onClick={() =>
            trackClick({
              location: PageLocation.page,
              buttonType: ButtonType.externalLink,
              actionType: 'navigation',
              actions: ['swagger-ui'],
            })
          }
        >
          {okmsData?.swaggerEndpoint}
        </OsdsLink>
      </TileItem>
      <Outlet />
    </Tile>
  );
};

export default InformationsTile;
