import { useNavigate } from 'react-router-dom';

import { useRegionName } from '@key-management-service/hooks/useRegionName';
import { SECRET_ACTIVATE_OKMS_TEST_IDS } from '@secret-manager/pages/create-secret/ActivateRegion.constants';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { useTranslation } from 'react-i18next';

import { Spinner, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Button } from '@ovh-ux/muk';

import { usePendingOkmsOrderStore } from '@/common/store/pendingOkmsOrder';

export type ActivateRegionParams = {
  selectedRegion: string;
};

export const ActivateRegion = ({ selectedRegion }: ActivateRegionParams) => {
  const { t } = useTranslation(['secret-manager', NAMESPACES.ACTIONS]);
  const { translateRegionName } = useRegionName();
  const navigate = useNavigate();
  const hasPendingOrder = usePendingOkmsOrderStore((state) => state.hasPendingOrder);
  const region = usePendingOkmsOrderStore((state) => state.region);

  if (hasPendingOrder) {
    return (
      <div className="flex items-center gap-3">
        <Spinner data-testid={SECRET_ACTIVATE_OKMS_TEST_IDS.SPINNER} />
        <Text>
          {t('okms_activation_in_progress', {
            region: region ? translateRegionName(region) : '',
          })}
        </Text>
      </div>
    );
  }

  return (
    <div>
      <Button
        data-testid={SECRET_ACTIVATE_OKMS_TEST_IDS.BUTTON}
        onClick={() => navigate(SECRET_MANAGER_ROUTES_URLS.createSecretOrderOkms(selectedRegion))}
      >
        {t('activate', { ns: NAMESPACES.ACTIONS })}
      </Button>
    </div>
  );
};
