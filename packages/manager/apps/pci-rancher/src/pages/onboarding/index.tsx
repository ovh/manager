import React from 'react';
import { useTranslation } from 'react-i18next';
import onboardingImgSrc from '../../assets/onboarding-img.png';
import { OnboardingLayout } from '../../components/layout-helpers/Onboarding';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import PageLayout from '@/components/PageLayout/PageLayout';

export default function Onboarding() {
  const { t } = useTranslation('pci-rancher/onboarding');
  const title: string = t('title');
  const description: string = t('description');

  return (
    <PageLayout>
      <Breadcrumb />
      <OnboardingLayout
        title={title}
        imageSrc={onboardingImgSrc}
        description={description}
        orderButtonLabel={t('orderButtonLabel')}
        orderHref={t('orderButtonLink')}
        moreInfoButtonLabel={t('moreInfoButtonLabel')}
        moreInfoHref={t('moreInfoButtonLink')}
      />
    </PageLayout>
  );
}
