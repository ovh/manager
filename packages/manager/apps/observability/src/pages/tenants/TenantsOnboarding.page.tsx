import React from 'react';

import { useTranslation } from 'react-i18next';

import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { OnboardingLayout, RedirectionGuard } from '@ovh-ux/manager-react-components';

import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { urls } from '@/routes/Routes.constants';
import { IAM_ACTIONS } from '@/utils/iam.constants';
import { LABELS } from '@/utils/labels.constants';
import { ONBOARDING_IMG_SRC } from '@/utils/onboarding.constants';

const TenantsOnboarding: React.FC = () => {
  const { t } = useTranslation(['tenants', NAMESPACES.ONBOARDING]);
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
          <OdsText preset="paragraph" className="text-center">
            {t('tenants:onboarding.description')}
          </OdsText>
        }
        img={ONBOARDING_IMG_SRC}
        orderIam={{
          urn: selectedService?.iam?.urn ?? '',
          iamActions: IAM_ACTIONS.CREATE_TENANT,
          displayTooltip: true,
        }}
        orderButtonLabel={t('tenants:onboarding.orderButtonLabel')}
        orderHref="https://www.ovh.com" // TODO
        moreInfoButtonLabel={t(`${NAMESPACES.ONBOARDING}:find_out_more`)}
        moreInfoHref={'https://www.ovh.com'} // TODO
      />
    </RedirectionGuard>
  );
};

export default TenantsOnboarding;
