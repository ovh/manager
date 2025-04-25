import React from 'react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router-dom';
import { useVrackService } from '@ovh-ux/manager-network-common';
import { OnboardingLayout, PageLayout } from '@ovh-ux/manager-react-components';
import onboardingImgSrc from '@/assets/onboarding-img.png';
import { useNavigateToCreateSubnetPage } from '../subnets.hook';
import { urls } from '@/routes/routes.constants';
import { hasSubnet, isEditable } from '@/utils/vrack-services';

export default function SubnetsOnboarding() {
  const { t } = useTranslation('vrack-services/subnets');
  const { id } = useParams();
  const { data: vs } = useVrackService();
  const navigateToCreateSubnetPage = useNavigateToCreateSubnetPage();

  if (hasSubnet(vs)) {
    return <Navigate to={urls.subnetsListing.replace(':id', id)} />;
  }

  return (
    <PageLayout>
      <OnboardingLayout
        moreInfoButtonLabel={t('createSubnetButtonLabel')}
        onmoreInfoButtonClick={navigateToCreateSubnetPage}
        moreInfoIcon={ODS_ICON_NAME.plus}
        isMoreInfoDisabled={!isEditable(vs)}
        title={t('subnetsOnboardingTitle')}
        description={t('subnetsOnboardingDescription')}
        img={{ src: onboardingImgSrc }}
      />
    </PageLayout>
  );
}
