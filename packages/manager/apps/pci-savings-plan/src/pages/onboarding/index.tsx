import React from 'react';
import { useTranslation } from 'react-i18next';
import { OnboardingLayout, PageLayout } from '@ovh-ux/manager-react-components';
import { useNavigate } from 'react-router-dom';
import onboardingImgSrc from './onboarding-img.png';

export default function Onboarding() {
  const { t } = useTranslation('onboarding');
  const navigate = useNavigate();

  return (
    <OnboardingLayout
      title={t('title')}
      img={{
        src: onboardingImgSrc,
      }}
      description={t('description')}
      orderButtonLabel={t('orderButtonLabel')}
      onOrderButtonClick={() => navigate('../new')}
      moreInfoButtonLabel={t('moreInfoButtonLabel')}
      moreInfoHref={t('moreInfoButtonLink')}
    />
  );
}
