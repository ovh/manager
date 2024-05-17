import React from 'react';
import { ODS_BUTTON_SIZE, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router-dom';
import { OnboardingLayout } from '@/components/layout-helpers/OnboardingLayout';
import onboardingImgSrc from '@/assets/onboarding-img.png';
import { hasSubnet, isEditable, useVrackService } from '@/api';
import { useNavigateToCreateSubnetPage } from './subnets.hook';
import { urls } from '@/router/constants';

export default function SubnetsOnboarding() {
  const { t } = useTranslation('vrack-services/subnets');
  const { id } = useParams();
  const { data: vs } = useVrackService();
  const navigateToCreateSubnetPage = useNavigateToCreateSubnetPage();

  if (hasSubnet(vs)) {
    return <Navigate to={urls.subnetsListing.replace(':id', id)} />;
  }

  return (
    <OnboardingLayout
      secondaryButtonLabel={t('createSubnetButtonLabel')}
      secondaryOnClick={navigateToCreateSubnetPage}
      secondaryButtonIcon={ODS_ICON_NAME.ADD}
      secondaryButtonSize={ODS_BUTTON_SIZE.sm}
      secondaryButtonIconPosition="start"
      secondaryButtonDisabled={!isEditable(vs) || undefined}
      title={t('subnetsOnboardingTitle')}
      description={t('subnetsOnboardingDescription')}
      imageSrc={onboardingImgSrc}
      noBreadcrumb
    />
  );
}
