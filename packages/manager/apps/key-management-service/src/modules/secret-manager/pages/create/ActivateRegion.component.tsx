import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { OdsButton, OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';
import {
  ACTIVATE_DOMAIN_BTN_TEST_ID,
  ACTIVATE_DOMAIN_SPINNER_TEST_ID,
} from '@secret-manager/utils/tests/secret.constants';
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
      <OdsSpinner size="sm" data-testid={ACTIVATE_DOMAIN_SPINNER_TEST_ID} />
      <OdsText>{t('domain_activation_in_progress')}</OdsText>
    </div>
  ) : (
    <div>
      <OdsButton
        data-testid={ACTIVATE_DOMAIN_BTN_TEST_ID}
        label={t('activate', { ns: NAMESPACES.ACTIONS })}
        onClick={() =>
          navigate(
            SECRET_MANAGER_ROUTES_URLS.secretCreateOrderOkms(selectedRegion),
          )
        }
      />
    </div>
  );
};
