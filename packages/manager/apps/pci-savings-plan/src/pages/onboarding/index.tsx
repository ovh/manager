import React from 'react';
import { useTranslation } from 'react-i18next';
import { OnboardingLayout, PageLayout } from '@ovhcloud/manager-components';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import onboardingImgSrc from './onboarding-img.png';

export default function Onboarding() {
  const { t } = useTranslation('onboarding');
  const navigate = useNavigate();

  return (
    <PageLayout>
      <Breadcrumb />
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
    </PageLayout>
  );
}
