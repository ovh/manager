import React from 'react';
import { ODS_BUTTON_SIZE, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useVrackService } from '@ovh-ux/manager-network-common';
import { OnboardingLayout } from '@/components/layout-helpers/OnboardingLayout.component';
import onboardingImgSrc from '@/assets/onboarding-img.png';
import { useNavigateToCreateEndpointPage } from '../endpoints.hook';
import { hasSubnet, isEditable } from '@/utils/vrack-services';

export default function EndpointsOnboarding() {
  const { t } = useTranslation('vrack-services/endpoints');
  const { data: vrackServices } = useVrackService();
  const navigateToCreateEndpointPage = useNavigateToCreateEndpointPage();

  return (
    <OnboardingLayout
      secondaryButtonLabel={t('createEndpointButtonLabel')}
      secondaryOnClick={navigateToCreateEndpointPage}
      secondaryButtonIcon={ODS_ICON_NAME.ADD}
      secondaryButtonSize={ODS_BUTTON_SIZE.sm}
      secondaryButtonIconPosition="start"
      secondaryButtonDisabled={
        !isEditable(vrackServices) || !hasSubnet(vrackServices) || undefined
      }
      title={t('endpointsOnboardingTitle')}
      description={t('endpointsOnboardingDescription')}
      imageSrc={onboardingImgSrc}
      noBreadcrumb
    />
  );
}
