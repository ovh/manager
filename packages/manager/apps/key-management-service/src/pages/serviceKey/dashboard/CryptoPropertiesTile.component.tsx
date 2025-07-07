import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  DashboardTile,
  DashboardTileBlockItem,
} from '@ovh-ux/manager-react-components';
import { ServiceKeyOperations } from '@/components/serviceKey/serviceKeyOperations/serviceKeyOperations.component';
import { ServiceKeyType } from '@/components/serviceKey/serviceKeyType/serviceKeyType.component';
import { OkmsServiceKey } from '@/types/okmsServiceKey.type';

type CryptoPropertiesTileProps = {
  serviceKey: OkmsServiceKey;
};

export const CryptoPropertiesTile = ({
  serviceKey,
}: CryptoPropertiesTileProps) => {
  const { t } = useTranslation('key-management-service/serviceKeys');

  const items: DashboardTileBlockItem[] = [
    {
      id: 'origin',
      label: t('key_management_service_service-keys_dashboard_field_origin'),
      value: (
        <OdsText preset={ODS_TEXT_PRESET.span}>
          {t('key_management_service_service-keys_dashboard_field_origin_okms')}
        </OdsText>
      ),
    },
    {
      id: 'type',
      label: t('key_management_service_service-keys_dashboard_field_type'),
      value: <ServiceKeyType type={serviceKey.type} />,
    },
  ];

  if (serviceKey.size) {
    items.push({
      id: 'size',
      label: t('key_management_service_service-keys_dashboard_field_size'),
      value: <OdsText preset={ODS_TEXT_PRESET.span}>{serviceKey.size}</OdsText>,
    });
  }

  if (serviceKey.curve) {
    items.push({
      id: 'size',
      label: t('key_management_service_service-keys_dashboard_field_curve'),
      value: (
        <OdsText preset={ODS_TEXT_PRESET.span}>{serviceKey.curve}</OdsText>
      ),
    });
  }

  items.push({
    id: 'operations',
    label: t('key_management_service_service-keys_dashboard_field_operations'),
    value: <ServiceKeyOperations operations={serviceKey.operations} />,
  });

  return (
    <DashboardTile
      title={t(
        'key_management_service_service-keys_dashboard_tile_crypto_properties',
      )}
      items={items}
    />
  );
};
