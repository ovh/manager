import React from 'react';
import { useTranslation } from 'react-i18next';
import { OnboardingLayout } from '@ovh-ux/manager-react-components';
import onboardingImgSrc from './onboarding-img.png';

export default function Onboarding() {
  const { t } = useTranslation('onboarding');

  const title: string = t('title');
  const description: string = t('description');

  const onOrderButtonClick = () => {
    window.open(
      'https://labs.ovhcloud.com/en/zimbra-beta/',
      '_blank',
      'noopener',
    );
  };

  return (
    <OnboardingLayout
      title={title}
      img={{ src: onboardingImgSrc }}
      description={description}
      orderButtonLabel={t('orderButtonLabel')}
      onOrderButtonClick={onOrderButtonClick}
    ></OnboardingLayout>
  );
}
