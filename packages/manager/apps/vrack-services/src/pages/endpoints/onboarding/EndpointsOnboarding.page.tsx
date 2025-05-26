import React from 'react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useVrackService } from '@ovh-ux/manager-network-common';
import { PageLayout, OnboardingLayout } from '@ovh-ux/manager-react-components';
import onboardingImgSrc from '@/assets/onboarding-img.png';
import { useNavigateToCreateEndpointPage } from '../endpoints.hook';
import { hasSubnet, isEditable } from '@/utils/vrack-services';

export default function EndpointsOnboarding() {
  const { t } = useTranslation('vrack-services/endpoints');
  const { data: vrackServices } = useVrackService();
  const navigateToCreateEndpointPage = useNavigateToCreateEndpointPage();

  return (
    <PageLayout>
      <OnboardingLayout
        moreInfoButtonLabel={t('createEndpointButtonLabel')}
        onMoreInfoButtonClick={navigateToCreateEndpointPage}
        moreInfoButtonIcon={ODS_ICON_NAME.plus}
        isMoreInfoButtonDisabled={
          !isEditable(vrackServices) || !hasSubnet(vrackServices)
        }
        title={t('endpointsOnboardingTitle')}
        description={t('endpointsOnboardingDescription')}
        img={{ src: onboardingImgSrc }}
      />
    </PageLayout>
  );
}
