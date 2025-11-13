import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { OnboardingLayout, RedirectionGuard, Text } from '@ovh-ux/muk';

import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { urls } from '@/routes/Routes.constants';
import { IAM_ACTIONS } from '@/utils/iam.constants';
import { LABELS } from '@/utils/labels.constants';
import { ONBOARDING_IMG_SRC } from '@/utils/onboarding.constants';

const TenantsOnboarding: React.FC = () => {
  const { t } = useTranslation(['tenants', NAMESPACES.ONBOARDING]);
  const navigate = useNavigate();
  const { selectedService, isLoading, isSuccess } = useObservabilityServiceContext();
  return (
    <RedirectionGuard
      condition={!selectedService && isSuccess}
      isLoading={isLoading}
      route={urls.tenants}
    >
      <OnboardingLayout
        title={LABELS.TENANT}
        description={
          <Text preset="paragraph" className="text-center">
            {t('tenants:onboarding.description')}
          </Text>
        }
        img={ONBOARDING_IMG_SRC}
        orderIam={{
          urn: selectedService?.iam?.urn ?? '',
          iamActions: IAM_ACTIONS.CREATE_TENANT,
          displayTooltip: true,
        }}
        orderButtonLabel={t('tenants:onboarding.orderButtonLabel')}
        onOrderButtonClick={() => navigate(urls.tenantsCreation)}
        moreInfoButtonLabel={t(`${NAMESPACES.ONBOARDING}:find_out_more`)}
        moreInfoHref={'https://www.ovh.com'} // TODO
      />
    </RedirectionGuard>
  );
};

export default TenantsOnboarding;
