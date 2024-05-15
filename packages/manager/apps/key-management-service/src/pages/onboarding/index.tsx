import { OnboardingLayout } from '@ovhcloud/manager-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useKmsGuides } from '@/hooks/useKmsGuides';
import { ROUTES_URLS } from '@/routes/routes.constants';
import onboardingImgSrc from './onboarding-img.png';

export default function Onboarding() {
  const { t } = useTranslation('key-management-service/onboarding');
  const navigate = useNavigate();
  const { kmsOnboardingGuide } = useKmsGuides();

  return (
    <OnboardingLayout
      title={t('title')}
      img={{ src: onboardingImgSrc }}
      description={t('description')}
      additionalDescriptions={[t('description_secondary')]}
      orderButtonLabel={t('orderButtonLabel')}
      onOrderButtonClick={() =>
        navigate(ROUTES_URLS.createKeyManagementService)
      }
      moreInfoButtonLabel={kmsOnboardingGuide?.label?.toString()}
      moreInfoHref={kmsOnboardingGuide?.href}
    ></OnboardingLayout>
  );
}
