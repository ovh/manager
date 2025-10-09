import React from 'react';

import { useTranslation } from 'react-i18next';

import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { OnboardingLayout } from '@ovh-ux/manager-react-components';

import { LABELS } from '@/utils/labels.constants';
import { ONBOARDING_IMG_SRC } from '@/utils/onboarding.constants';

const TenantsOnboarding: React.FC = () => {
  const { t } = useTranslation(['tenants', NAMESPACES.ONBOARDING]);

  return (
    <OnboardingLayout
      title={LABELS.TENANT}
      description={
        <OdsText preset="paragraph" className="text-center">
          {t('tenants:onboarding.description')}
        </OdsText>
      }
      img={ONBOARDING_IMG_SRC}
      orderIam={{
        urn: 'urn:v1:eu:resource:xxxx', // TODO: replace with the correct urn once API is ready
        iamActions: ['ldp:apiovh:tenant/create'], // TODO: check iam actions to add
        displayTooltip: true,
      }}
      orderButtonLabel={t('tenants:onboarding.orderButtonLabel')}
      orderHref="https://www.ovh.com" // TODO
      moreInfoButtonLabel={t(`${NAMESPACES.ONBOARDING}:find_out_more`)}
      moreInfoHref={'https://www.ovh.com'} // TODO
    />
  );
};

export default TenantsOnboarding;
