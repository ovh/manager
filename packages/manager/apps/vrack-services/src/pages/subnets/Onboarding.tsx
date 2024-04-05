import React from 'react';
import { ODS_BUTTON_SIZE, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { OnboardingLayout } from '@/components/layout-helpers/OnboardingLayout';
import onboardingImgSrc from '@/assets/onboarding-img.png';
import { isEditable, useVrackService } from '@/utils/vs-utils';
import { PageType } from '@/utils/tracking';
import { useNavigateToCreateSubnetPage } from './subnets.hook';

export default function SubnetsOnboarding() {
  const { t } = useTranslation('vrack-services/subnets');
  const { data: vrackServices } = useVrackService();
  const navigateToCreateSubnetPage = useNavigateToCreateSubnetPage(
    PageType.onboarding,
  );

  return (
    <OnboardingLayout
      secondaryButtonLabel={t('createSubnetButtonLabel')}
      secondaryOnClick={navigateToCreateSubnetPage}
      secondaryButtonIcon={ODS_ICON_NAME.ADD}
      secondaryButtonSize={ODS_BUTTON_SIZE.sm}
      secondaryButtonIconPosition="start"
      secondaryButtonDisabled={!isEditable(vrackServices) || undefined}
      title={t('onboardingTitle')}
      description={t('onboardingDescription')}
      imageSrc={onboardingImgSrc}
      noBreadcrumb
    />
  );
}
