import { ServiceKeyOperations } from '@key-management-service/components/service-key/service-key-operations/serviceKeyOperations.component';
import { ServiceKeyType } from '@key-management-service/components/service-key/service-key-type/serviceKeyType.component';
import { OkmsServiceKey } from '@key-management-service/types/okmsServiceKey.type';
import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { Tile } from '@ovh-ux/muk';

type CryptoPropertiesTileProps = {
  serviceKey: OkmsServiceKey;
};

export const CryptoPropertiesTile = ({ serviceKey }: CryptoPropertiesTileProps) => {
  const { t } = useTranslation('key-management-service/serviceKeys');

  return (
    <Tile.Root title={t('key_management_service_service-keys_dashboard_tile_crypto_properties')}>
      <Tile.Item.Root>
        <Tile.Item.Term label={t('key_management_service_service-keys_dashboard_field_origin')} />
        <Tile.Item.Description>
          <Text preset="span">
            {t('key_management_service_service-keys_dashboard_field_origin_okms')}
          </Text>
        </Tile.Item.Description>
      </Tile.Item.Root>
      <Tile.Item.Root>
        <Tile.Item.Term label={t('key_management_service_service-keys_dashboard_field_type')} />
        <Tile.Item.Description>
          <ServiceKeyType type={serviceKey.type} />
        </Tile.Item.Description>
      </Tile.Item.Root>
      {serviceKey.size && (
        <Tile.Item.Root>
          <Tile.Item.Term label={t('key_management_service_service-keys_dashboard_field_size')} />
          <Tile.Item.Description>
            <Text preset="span">{serviceKey.size}</Text>
          </Tile.Item.Description>
        </Tile.Item.Root>
      )}
      {serviceKey.curve && (
        <Tile.Item.Root>
          <Tile.Item.Term label={t('key_management_service_service-keys_dashboard_field_curve')} />
          <Tile.Item.Description>
            <Text preset="span">{serviceKey.curve}</Text>
          </Tile.Item.Description>
        </Tile.Item.Root>
      )}
      <Tile.Item.Root>
        <Tile.Item.Term
          label={t('key_management_service_service-keys_dashboard_field_operations')}
        />
        <Tile.Item.Description divider={false}>
          <ServiceKeyOperations operations={serviceKey.operations} />
        </Tile.Item.Description>
      </Tile.Item.Root>
    </Tile.Root>
  );
};
