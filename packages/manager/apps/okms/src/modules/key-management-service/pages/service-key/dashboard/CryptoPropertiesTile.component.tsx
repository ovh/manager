import ServiceKeyDownloadActions from '@key-management-service/components/service-key/service-key-download-actions/ServiceKeyDownloadActions.component';
import { ServiceKeyOperations } from '@key-management-service/components/service-key/service-key-operations/serviceKeyOperations.component';
import { ServiceKeyType } from '@key-management-service/components/service-key/service-key-type/serviceKeyType.component';
import { OKMS } from '@key-management-service/types/okms.type';
import { OkmsServiceKey } from '@key-management-service/types/okmsServiceKey.type';
import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { Tile } from '@ovh-ux/muk';

import { SERVICE_KEY_TEST_IDS } from './ServiceKeyDashboard.constants';

type CryptoPropertiesTileProps = {
  kms: OKMS;
  serviceKey: OkmsServiceKey;
};

export const CryptoPropertiesTile = ({ kms, serviceKey }: CryptoPropertiesTileProps) => {
  const { t } = useTranslation('key-management-service/serviceKeys');

  return (
    <Tile.Root title={t('key_management_service_service-keys_dashboard_tile_crypto_properties')}>
      <Tile.Item.Root>
        <Tile.Item.Term label={t('key_management_service_service-keys_dashboard_field_origin')} />
        <Tile.Item.Description>
          <Text preset="span" data-testid={SERVICE_KEY_TEST_IDS.origin}>
            {t('key_management_service_service-keys_dashboard_field_origin_okms')}
          </Text>
        </Tile.Item.Description>
      </Tile.Item.Root>
      <Tile.Item.Root>
        <Tile.Item.Term label={t('key_management_service_service-keys_dashboard_field_type')} />
        <Tile.Item.Description>
          <div data-testid={SERVICE_KEY_TEST_IDS.type}>
            <ServiceKeyType type={serviceKey.type} />
          </div>
        </Tile.Item.Description>
      </Tile.Item.Root>
      {serviceKey.size && (
        <Tile.Item.Root>
          <Tile.Item.Term label={t('key_management_service_service-keys_dashboard_field_size')} />
          <Tile.Item.Description>
            <Text preset="span" data-testid={SERVICE_KEY_TEST_IDS.size}>
              {serviceKey.size}
            </Text>
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
        <Tile.Item.Description>
          <div data-testid={SERVICE_KEY_TEST_IDS.usage}>
            <ServiceKeyOperations operations={serviceKey.operations} />
          </div>
        </Tile.Item.Description>
      </Tile.Item.Root>
      <Tile.Item.Root>
        <Tile.Item.Description divider={false}>
          <ServiceKeyDownloadActions okms={kms} okmsKey={serviceKey} />
        </Tile.Item.Description>
      </Tile.Item.Root>
    </Tile.Root>
  );
};
