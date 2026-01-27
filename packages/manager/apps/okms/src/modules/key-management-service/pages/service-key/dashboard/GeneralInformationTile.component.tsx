import { useNavigate } from 'react-router-dom';

import { TileValueDate } from '@key-management-service/components/dashboard/tile-value-date/tileValueDate.component';
import ServiceKeyStateActions from '@key-management-service/components/service-key/service-key-state-actions/ServiceKeyStateActions.component';
import { ServiceKeyStatus } from '@key-management-service/components/service-key/service-key-status-badge/ServiceKeyStatusBadge.component';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { OKMS } from '@key-management-service/types/okms.type';
import { OkmsServiceKey } from '@key-management-service/types/okmsServiceKey.type';
import { useTranslation } from 'react-i18next';

import { Icon, Text } from '@ovhcloud/ods-react';

import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { Tile } from '@ovh-ux/muk';
import { Button } from '@ovh-ux/muk';
import { Clipboard } from '@ovh-ux/muk';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { kmsIamActions } from '@/common/utils/iam/iam.constants';
import { URN_LABEL } from '@/constants';

import { SERVICE_KEY_TEST_IDS } from './ServiceKeyDashboard.constants';

type GeneralInformationTileProps = {
  kms: OKMS;
  serviceKey: OkmsServiceKey;
};

export const GeneralInformationTile = ({ kms, serviceKey }: GeneralInformationTileProps) => {
  const { t } = useTranslation('key-management-service/serviceKeys');
  const navigate = useNavigate();
  const { trackClick } = useOkmsTracking();

  return (
    <Tile.Root title={t('key_management_service_service-keys_dashboard_tile_general_informations')}>
      <Tile.Item.Root>
        <Tile.Item.Term label={t('key_management_service_service-keys_dashboard_field_name')} />
        <Tile.Item.Description>
          <div className="flex items-center justify-between gap-2">
            <Text
              className="max-w-1/2 overflow-hidden text-ellipsis"
              preset="paragraph"
              data-testid={SERVICE_KEY_TEST_IDS.displayName}
            >
              {serviceKey.name}
            </Text>
            <Button
              id="editName"
              data-testid={SERVICE_KEY_TEST_IDS.editNameButton}
              size="sm"
              variant="ghost"
              color="primary"
              urn={serviceKey.iam.urn}
              iamActions={[kmsIamActions.serviceKeyUpdate]}
              onClick={() => {
                trackClick({
                  location: PageLocation.page,
                  buttonType: ButtonType.button,
                  actionType: 'action',
                  actions: ['rename', 'service-key'],
                });
                navigate(KMS_ROUTES_URLS.serviceKeyEditName(kms.id, serviceKey.id));
              }}
            >
              <Icon name="pen" />
            </Button>
          </div>
        </Tile.Item.Description>
      </Tile.Item.Root>
      <Tile.Item.Root>
        <Tile.Item.Term label={t('key_management_service_service-keys_dashboard_field_id')} />
        <Tile.Item.Description>
          <Clipboard
            className="w-full"
            value={serviceKey.id}
            data-testid={SERVICE_KEY_TEST_IDS.keyId}
          />
        </Tile.Item.Description>
      </Tile.Item.Root>
      <Tile.Item.Root>
        <Tile.Item.Term label={URN_LABEL} />
        <Tile.Item.Description>
          <Clipboard
            className="w-full"
            value={serviceKey.iam.urn}
            data-testid={SERVICE_KEY_TEST_IDS.urn}
          />
        </Tile.Item.Description>
      </Tile.Item.Root>
      <Tile.Item.Root>
        <Tile.Item.Term label={t('key_management_service_service-keys_dashboard_field_state')} />
        <Tile.Item.Description>
          <div>
            <ServiceKeyStatus state={serviceKey.state} data-testid={SERVICE_KEY_TEST_IDS.status} />
            <ServiceKeyStateActions okms={kms} okmsKey={serviceKey} />
          </div>
        </Tile.Item.Description>
      </Tile.Item.Root>
      <Tile.Item.Root>
        <Tile.Item.Term
          label={t('key_management_service_service-keys_dashboard_field_created_at')}
        />
        <Tile.Item.Description divider={false}>
          <div data-testid={SERVICE_KEY_TEST_IDS.creationDate}>
            <TileValueDate
              value={serviceKey.createdAt}
              options={{
                hour12: false,
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
              }}
            />
          </div>
        </Tile.Item.Description>
      </Tile.Item.Root>
    </Tile.Root>
  );
};
