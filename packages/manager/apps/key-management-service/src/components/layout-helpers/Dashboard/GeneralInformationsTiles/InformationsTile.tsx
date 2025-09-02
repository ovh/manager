import React from 'react';
import {
  Clipboard,
  DashboardTile,
  DashboardTileBlockItem,
  Region,
} from '@ovh-ux/manager-react-components';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';
import { OKMS } from '@/types/okms.type';
import { KMS_ROUTES_URLS } from '@/routes/routes.constants';

type InformationTileProps = {
  okmsData: OKMS;
  okmsDisplayName: string;
};

const InformationsTile = ({
  okmsData,
  okmsDisplayName,
}: InformationTileProps) => {
  const { t } = useTranslation('key-management-service/dashboard');
  const navigate = useNavigate();

  const items: DashboardTileBlockItem[] = [
    {
      id: 'name',
      label: t('key_management_service_dashboard_field_label_name'),
      value: (
        <div className="flex justify-between items-center gap-2">
          <OdsText preset={ODS_TEXT_PRESET.paragraph} className="break-all">
            {okmsDisplayName}
          </OdsText>
          <div className="min-w-fit">
            <OdsButton
              aria-label="edit"
              size={ODS_BUTTON_SIZE.sm}
              variant={ODS_BUTTON_VARIANT.ghost}
              color={ODS_BUTTON_COLOR.primary}
              onClick={() =>
                navigate(KMS_ROUTES_URLS.kmsEditName(okmsData?.id))
              }
              icon={ODS_ICON_NAME.pen}
              label=""
            />
          </div>
        </div>
      ),
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
      id: 'kmip-count',
      label: t('key_management_service_dashboard_field_label_kmip_count'),
      value: (
        <OdsText preset={ODS_TEXT_PRESET.span}>
          {okmsData?.kmipObjectCount}
        </OdsText>
      ),
    },
    {
      id: 'service-keys-count',
      label: t(
        'key_management_service_dashboard_field_label_service-keys_count',
      ),
      value: (
        <OdsText preset={ODS_TEXT_PRESET.span}>
          {okmsData?.serviceKeyCount}
        </OdsText>
      ),
    },
  ];

  return (
    <>
      <DashboardTile title={t('general_informations')} items={items} />
      <Outlet />
    </>
  );
};

export default InformationsTile;
