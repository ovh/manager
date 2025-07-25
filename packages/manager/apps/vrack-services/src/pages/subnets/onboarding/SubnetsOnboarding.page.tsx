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
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

export default function SubnetsOnboarding() {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.subnets);
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
        onMoreInfoButtonClick={navigateToCreateSubnetPage}
        moreInfoButtonIcon={ODS_ICON_NAME.plus}
        isMoreInfoButtonDisabled={!isEditable(vs)}
        title={t('subnetsOnboardingTitle')}
        description={t('subnetsOnboardingDescription')}
        img={{ src: onboardingImgSrc }}
      />
    </PageLayout>
  );
}
