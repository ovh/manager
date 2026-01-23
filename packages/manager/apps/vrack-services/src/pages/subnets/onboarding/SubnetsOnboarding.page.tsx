import React from 'react';

import { Navigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { useVrackService } from '@ovh-ux/manager-network-common';
import { BaseLayout, OnboardingLayout } from '@ovh-ux/muk';

import onboardingImgSrc from '@/assets/onboarding-img.png';
import { urls } from '@/routes/RoutesAndUrl.constants';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';
import { hasSubnet, isEditable } from '@/utils/vrack-services';

import { useNavigateToCreateSubnetPage } from '../subnets.hook';

export default function SubnetsOnboarding() {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.subnets);
  const { id } = useParams();
  const { data: vs } = useVrackService();
  const navigateToCreateSubnetPage = useNavigateToCreateSubnetPage();

  if (hasSubnet(vs)) {
    return <Navigate to={urls.subnetsListing.replace(':id', id || '')} />;
  }

  return (
    <BaseLayout>
      <OnboardingLayout
        orderButtonLabel={t('createSubnetButtonLabel')}
        onOrderButtonClick={navigateToCreateSubnetPage}
        isActionDisabled={!isEditable(vs)}
        title={t('subnetsOnboardingTitle')}
        description={t('subnetsOnboardingDescription')}
        img={{ src: onboardingImgSrc }}
      />
    </BaseLayout>
  );
}
