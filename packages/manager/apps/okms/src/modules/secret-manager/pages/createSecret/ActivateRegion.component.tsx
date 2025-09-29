import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { OdsButton, OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';
import { SECRET_ACTIVATE_OKMS_TEST_IDS } from '@secret-manager/pages/createSecret/ActivateRegion.contants';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

export type ActivateRegionParams = {
  selectedRegion: string;
  isOkmsOrderProcessing: boolean;
};

export const ActivateRegion = ({
  selectedRegion,
  isOkmsOrderProcessing,
}: ActivateRegionParams) => {
  const { t } = useTranslation(['secret-manager', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();

  return isOkmsOrderProcessing ? (
    <div className="flex items-center gap-3">
      <OdsSpinner
        size="sm"
        data-testid={SECRET_ACTIVATE_OKMS_TEST_IDS.SPINNER}
      />
      <OdsText>{t('okms_activation_in_progress')}</OdsText>
    </div>
  ) : (
    <div>
      <OdsButton
        data-testid={SECRET_ACTIVATE_OKMS_TEST_IDS.BUTTON}
        label={t('activate', { ns: NAMESPACES.ACTIONS })}
        onClick={() =>
          navigate(
            SECRET_MANAGER_ROUTES_URLS.createSecretOrderOkms(selectedRegion),
          )
        }
      />
    </div>
  );
};
