import { ServiceKeyOperations } from '@key-management-service/components/service-key/service-key-operations/serviceKeyOperations.component';
import { ServiceKeyType } from '@key-management-service/components/service-key/service-key-type/serviceKeyType.component';
import { OkmsServiceKey } from '@key-management-service/types/okmsServiceKey.type';
import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { DashboardTile, DashboardTileBlockItem } from '@ovh-ux/manager-react-components';

type CryptoPropertiesTileProps = {
  serviceKey: OkmsServiceKey;
};

export const CryptoPropertiesTile = ({ serviceKey }: CryptoPropertiesTileProps) => {
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
      value: <OdsText preset={ODS_TEXT_PRESET.span}>{serviceKey.curve}</OdsText>,
    });
  }

  items.push({
    id: 'operations',
    label: t('key_management_service_service-keys_dashboard_field_operations'),
    value: <ServiceKeyOperations operations={serviceKey.operations} />,
  });

  return (
    <DashboardTile
      title={t('key_management_service_service-keys_dashboard_tile_crypto_properties')}
      items={items}
    />
  );
};
