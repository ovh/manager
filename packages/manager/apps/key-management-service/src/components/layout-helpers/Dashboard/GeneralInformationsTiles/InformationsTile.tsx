import React from 'react';
import {
  Clipboard,
  DashboardTile,
  DashboardTileBlockItem,
  LinkType,
  Links,
  Region,
  ServiceDetails,
} from '@ovh-ux/manager-react-components';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
} from '@ovhcloud/ods-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';
import { OKMS } from '@/types/okms.type';
import { ROUTES_URLS } from '@/routes/routes.constants';
import {
  KMIP_LABEL,
  KMIP_RSA_LABEL,
  SWAGGER_UI_LABEL,
} from './InformationsTile.constants';

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

  const items: DashboardTileBlockItem[] = [
    {
      id: 'name',
      label: t('key_management_service_dashboard_field_label_name'),
      value: (
        <div className="flex justify-between items-center gap-2">
          <OdsText preset={ODS_TEXT_PRESET.paragraph} className="break-all">
            {okmsServiceInfos?.resource.displayName}
          </OdsText>
          <div className="min-w-fit">
            <OdsButton
              aria-label="edit"
              size={ODS_BUTTON_SIZE.sm}
              variant={ODS_BUTTON_VARIANT.ghost}
              color={ODS_BUTTON_COLOR.primary}
              onClick={() => navigate(ROUTES_URLS.okmsUpdateName)}
              icon={ODS_ICON_NAME.pen}
              label=""
            />
          </div>
        </div>
      ),
    },
    {
      id: 'id',
      label: t('key_management_service_dashboard_field_label_id'),
      value: <Clipboard className="block w-full" value={okmsData?.id} />,
    },
    {
      id: 'urn',
      label: t('key_management_service_dashboard_field_label_urn'),
      value: <Clipboard className="block w-full" value={okmsData?.iam.urn} />,
    },
    {
      id: 'region',
      label: t('key_management_service_dashboard_field_label_region'),
      value: (
        <OdsText preset={ODS_TEXT_PRESET.span}>
          <Region mode="region" name={okmsData.region} />
        </OdsText>
      ),
    },
    {
      id: 'restApi',
      label: t('key_management_service_dashboard_field_label_restApi'),
      value: (
        <Clipboard className="block w-full" value={okmsData?.restEndpoint} />
      ),
    },
    {
      id: 'kmip',
      label: KMIP_LABEL,
      value: (
        <Clipboard className="block w-full" value={okmsData?.kmipEndpoint} />
      ),
    },
    {
      id: 'swagger',
      label: SWAGGER_UI_LABEL,
      value: (
        <Links
          type={LinkType.external}
          href={okmsData?.swaggerEndpoint}
          onClickReturn={() =>
            trackClick({
              location: PageLocation.page,
              buttonType: ButtonType.externalLink,
              actionType: 'navigation',
              actions: ['swagger-ui'],
            })
          }
          label={okmsData?.swaggerEndpoint}
        />
      ),
    },
  ];

  if (okmsData?.kmipRsaEndpoint) {
    items.splice(items.length - 1, 0, {
      id: 'kmipRsa',
      label: KMIP_RSA_LABEL,
      value: (
        <Clipboard className="block w-full" value={okmsData.kmipRsaEndpoint} />
      ),
    });
  }

  return (
    <>
      <DashboardTile title={t('general_informations')} items={items} />
      <Outlet />
    </>
  );
};

export default InformationsTile;
