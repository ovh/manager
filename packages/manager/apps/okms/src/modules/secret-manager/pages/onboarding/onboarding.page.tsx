import React from 'react';
import { OnboardingLayout } from '@ovh-ux/manager-react-components';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OdsText } from '@ovhcloud/ods-components/react';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import onboardingImage from './onboarding.svg';

export default function SecretManagerOnboardingPage() {
  const { t } = useTranslation('secret-manager/onboarding');
  const navigate = useNavigate();

  return (
    <OnboardingLayout
      title={t('title')}
      img={{ src: onboardingImage }}
      description={
        <div className="flex flex-col gap-2">
          <OdsText className="text-center">{t('description1')}</OdsText>
          <OdsText className="text-center">{t('description2')}</OdsText>
        </div>
      }
      orderButtonLabel={t('createButton')}
      onOrderButtonClick={() =>
        navigate(SECRET_MANAGER_ROUTES_URLS.secretCreate)
      }
    />
  );
}
