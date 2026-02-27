import React from 'react';

import { useTranslation } from 'react-i18next';

import { useVrackService } from '@ovh-ux/manager-network-common';
import { BaseLayout, OnboardingLayout } from '@ovh-ux/muk';

import onboardingImgSrc from '@/assets/onboarding-img.png';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';
import { hasSubnet, isEditable } from '@/utils/vrack-services';

import { useNavigateToCreateEndpointPage } from '../endpoints.hook';

export default function EndpointsOnboarding() {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.endpoints);
  const { data: vrackServices } = useVrackService();
  const navigateToCreateEndpointPage = useNavigateToCreateEndpointPage();

  return (
    <BaseLayout>
      <OnboardingLayout
        orderButtonLabel={t('createEndpointButtonLabel')}
        onOrderButtonClick={navigateToCreateEndpointPage}
        isActionDisabled={!isEditable(vrackServices) || !hasSubnet(vrackServices)}
        title={t('endpointsOnboardingTitle')}
        description={t('endpointsOnboardingDescription')}
        img={{ src: onboardingImgSrc }}
      />
    </BaseLayout>
  );
}
