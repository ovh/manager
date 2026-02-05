import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { OnboardingLayout, Text } from '@ovh-ux/muk';

import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { getManagedDashboardCreationUrl } from '@/routes/Routes.utils';
import { IAM_ACTIONS } from '@/utils/iam.constants';
import { ONBOARDING_IMG_SRC } from '@/utils/onboarding.constants';

const OnboardingManagedDashboards: React.FC = () => {
  const navigate = useNavigate();

  const { t } = useTranslation(['managed-dashboards', NAMESPACES.ONBOARDING]);
  const { selectedService, isLoading } = useObservabilityServiceContext();

  const addNewManagedDashboard = () => {
    navigate(getManagedDashboardCreationUrl({ resourceName: selectedService?.id ?? '' }));
  };

  return (
    <OnboardingLayout
      title={t('managed-dashboards:onboarding.title')}
      description={
        <Text preset="paragraph" className="text-center">
          {t('managed-dashboards:onboarding.description')}
        </Text>
      }
      img={ONBOARDING_IMG_SRC}
      isActionDisabled={isLoading}
      orderButtonLabel={t('managed-dashboards:onboarding.orderButton')}
      onOrderButtonClick={addNewManagedDashboard}
      orderIam={{
        urn: selectedService?.iam?.urn ?? '',
        iamActions: IAM_ACTIONS.CREATE_GRAFANA,
        displayTooltip: true,
      }}
      moreInfoButtonLabel={t(`${NAMESPACES.ONBOARDING}:find_out_more`)}
      moreInfoHref={'https://www.ovh.com'} // TODO
    />
  );
};

export default OnboardingManagedDashboards;
