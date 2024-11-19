import React from 'react';
import { useTranslation } from 'react-i18next';
import { OnboardingLayout } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import onboardingImgSrc from './onboarding-img.png';
import { JOIN_ZIMBRA_BETA } from '@/tracking.constant';

export default function Onboarding() {
  const { t } = useTranslation('onboarding');

  const title: string = t('title');
  const description: string = t('description');
  const { trackClick } = useOvhTracking();

  const onOrderButtonClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [JOIN_ZIMBRA_BETA],
    });

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
