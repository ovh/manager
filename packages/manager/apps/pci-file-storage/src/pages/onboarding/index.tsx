import React from 'react';
import { useTranslation } from 'react-i18next';
import { OnboardingLayout } from '@ovhcloud/manager-components';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import onboardingImgSrc from './onboarding-img.png';

export default function Onboarding() {
  const { t } = useTranslation('pci-file-storage/onboarding');

  const title: string = t('title');
  const description: string = t('description');
  const imgSrc = {
    src: onboardingImgSrc,
  };

  return (
    <>
      <Breadcrumb />
      <OnboardingLayout
        title={title}
        img={imgSrc}
        description={description}
        orderButtonLabel={t('orderButtonLabel')}
        className="mt-10"
      />
    </>
  );
}
