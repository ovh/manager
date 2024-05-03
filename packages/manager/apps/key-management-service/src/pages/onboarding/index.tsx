import { GuideItem, OnboardingLayout } from '@ovhcloud/manager-components';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useKmsGuides } from '@/hooks/useKmsGuides';
import { ROUTES_URLS } from '@/routes/routes.constants';
import onboardingImgSrc from './onboarding-img.png';

export default function Onboarding() {
  const [onboardingGuide, setOnboardingGuide] = useState<GuideItem>();
  const { t } = useTranslation('key-management-service/onboarding');
  const navigate = useNavigate();
  const { kmsOnboardingGuide } = useKmsGuides();

  useEffect(() => {
    if (kmsOnboardingGuide) {
      setOnboardingGuide(kmsOnboardingGuide);
    }
  }, [kmsOnboardingGuide]);

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
      moreInfoButtonLabel={onboardingGuide?.label?.toString()}
      moreInfoHref={onboardingGuide?.href}
    ></OnboardingLayout>
  );
}
