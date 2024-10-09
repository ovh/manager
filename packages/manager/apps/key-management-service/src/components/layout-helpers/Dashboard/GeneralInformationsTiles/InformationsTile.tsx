import React, { useState } from 'react';
import { OsdsButton, OsdsIcon, OsdsLink } from '@ovhcloud/ods-components/react';
import { Clipboard } from '@ovh-ux/manager-react-components';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_LINK_REFERRER_POLICY,
} from '@ovhcloud/ods-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { OKMS } from '@/types/okms.type';
import EditNameModal from '@/components/Modal/EditNameModal';
import { useUpdateOkmsName } from '@/data/hooks/useUpdateOkmsName';
import { Tile } from '@/components/dashboard/tile/tile.component';
import { TileSeparator } from '@/components/dashboard/tile-separator/tileSeparator';
import { TileValue } from '@/components/dashboard/tile-value/tileValue.component';
import { TileItem } from '@/components/dashboard/tile-item/tileItem.component';

type InformationTileProps = {
  okmsData?: OKMS;
};

const InformationsTile = ({ okmsData }: InformationTileProps) => {
  const { t } = useTranslation('key-management-service/dashboard');
  const { trackClick } = useOvhTracking();
  const [editModalDisplayed, setEditModalDisplayed] = useState(false);
  const { updateKmsName } = useUpdateOkmsName({});

  return (
    <Tile title={t('general_informations')}>
      {editModalDisplayed && (
        <EditNameModal
          okms={okmsData}
          toggleModal={setEditModalDisplayed}
          onEditName={(okms: OKMS) =>
            updateKmsName({ okms: okms.id, displayName: okms.iam.displayName })
          }
        />
      )}
      <TileSeparator />
      <TileItem title={t('key_management_service_dashboard_field_label_name')}>
        <div className="flex justify-between items-center">
          <TileValue value={okmsData?.iam.displayName} />
          <OsdsButton
            circle
            variant={ODS_BUTTON_VARIANT.stroked}
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={() => setEditModalDisplayed(true)}
          >
            <OsdsIcon
              aria-label="edit"
              onClick={() => setEditModalDisplayed(true)}
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
        <TileValue
          value={t(
            `key_management_service_dashboard_region_${okmsData?.region.toLowerCase()}`,
          )}
        />
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
    </Tile>
  );
};

export default InformationsTile;
