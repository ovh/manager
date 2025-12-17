import { useNavigate } from 'react-router-dom';

import { TileValueDate } from '@key-management-service/components/dashboard/tile-value-date/tileValueDate.component';
import ServiceKeyStateActions from '@key-management-service/components/service-key/service-key-state-actions/ServiceKeyStateActions.component';
import { ServiceKeyStatus } from '@key-management-service/components/service-key/service-key-status/serviceKeyStatus.component';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { OKMS } from '@key-management-service/types/okms.type';
import { OkmsServiceKey } from '@key-management-service/types/okmsServiceKey.type';
import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { Clipboard, DashboardTile, ManagerButton } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

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
    <DashboardTile
      title={t('key_management_service_service-keys_dashboard_tile_general_informations')}
      items={[
        {
          id: 'name',
          label: t('key_management_service_service-keys_dashboard_field_name'),
          value: (
            <div className="flex items-center justify-between gap-2">
              <OdsText
                className="max-w-1/2 overflow-hidden text-ellipsis"
                preset={ODS_TEXT_PRESET.paragraph}
                data-testid="truc"
              >
                {serviceKey.name}
              </OdsText>
              <ManagerButton
                id="editName"
                label=""
                data-testid={SERVICE_KEY_TEST_IDS.editNameButton}
                size={ODS_BUTTON_SIZE.sm}
                variant={ODS_BUTTON_VARIANT.ghost}
                color={ODS_BUTTON_COLOR.primary}
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
                icon={ODS_ICON_NAME.pen}
              />
            </div>
          ),
        },
        {
          id: 'id',
          label: t('key_management_service_service-keys_dashboard_field_id'),
          value: <Clipboard className="w-full" value={serviceKey.id} />,
        },
        {
          id: 'urn',
          label: URN_LABEL,
          value: <Clipboard className="w-full" value={serviceKey.iam.urn} />,
        },
        {
          id: 'state',
          label: t('key_management_service_service-keys_dashboard_field_state'),
          value: (
            <div>
              <ServiceKeyStatus state={serviceKey.state} />
              <ServiceKeyStateActions okms={kms} okmsKey={serviceKey} />
            </div>
          ),
        },
        {
          id: 'createdAt',
          label: t('key_management_service_service-keys_dashboard_field_created_at'),
          value: (
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
          ),
        },
      ]}
    />
  );
};
