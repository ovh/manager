import React from 'react';
import {
  Clipboard,
  DashboardTile,
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
    <>
      <DashboardTile
        title={t('general_informations')}
        items={[
          {
            id: 'name',
            label: t('key_management_service_dashboard_field_label_name'),
            value: (
              <div className="flex justify-between items-center gap-2">
                <OdsText
                  preset={ODS_TEXT_PRESET.paragraph}
                  className="break-all"
                >
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
            value: (
              <Clipboard className="block w-full" value={okmsData?.iam.urn} />
            ),
          },
          {
            id: 'region',
            label: t('key_management_service_dashboard_field_label_region'),
            value: (
              <OdsText preset={ODS_TEXT_PRESET.span}>
                <Region
                  mode="region"
                  name={okmsData.region.toLowerCase().replaceAll('_', '-')}
                />
              </OdsText>
            ),
          },
          {
            id: 'restApi',
            label: t('key_management_service_dashboard_field_label_restApi'),
            value: (
              <Clipboard
                className="block w-full"
                value={okmsData?.restEndpoint}
              />
            ),
          },
          {
            id: 'kmip',
            label: t('key_management_service_dashboard_field_label_kmip'),
            value: (
              <Clipboard
                className="block w-full"
                value={okmsData?.kmipEndpoint}
              />
            ),
          },
          {
            id: 'swagger',
            label: t('key_management_service_dashboard_field_label_swagger'),
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
        ]}
      />
      <Outlet />
    </>
  );
};

export default InformationsTile;
