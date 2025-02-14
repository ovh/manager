import React from 'react';
import { ODS_BUTTON_SIZE, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { OnboardingLayout } from '@/components/layout-helpers/OnboardingLayout.component';
import onboardingImgSrc from '@/assets/onboarding-img.png';
import { hasSubnet, isEditable, useVrackService } from '@/data';
import { useNavigateToCreateEndpointPage } from '../endpoints.hook';
import { IAM_ACTION } from '@/utils/iamActions.constants';

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
      iamActions={[
        IAM_ACTION.VRACK_SERVICES_RESOURCE_EDIT,
        IAM_ACTION.VRACK_SERVICES_ELIGIBLE_MANAGED_SERVICE_RESOURCE_GET,
      ]}
      urn={vrackServices.iam?.urn}
    />
  );
}
