import React from 'react';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { OnboardingLayout, Text } from '@ovh-ux/muk';

import { useObservabilityServiceOrderLink } from '@/hooks/useObservabilityServiceOrderLink.hook';
import { LABELS } from '@/utils/labels.constants';
import { ONBOARDING_IMG_SRC } from '@/utils/onboarding.constants';

const OnboardingService: React.FC = () => {
  const { t } = useTranslation(['metrics', NAMESPACES.ONBOARDING]);
  const orderLink = useObservabilityServiceOrderLink();

  return (
    <OnboardingLayout
      title={LABELS.TENANT}
      description={
        <Text preset="paragraph" className="text-center">
          {t('metrics:onboarding.description')}
        </Text>
      }
      img={ONBOARDING_IMG_SRC}
      orderButtonLabel={t('metrics:onboarding.orderButtonLabel')}
      orderHref={orderLink}
      moreInfoButtonLabel={t(`${NAMESPACES.ONBOARDING}:find_out_more`)}
      moreInfoHref={'https://www.ovh.com'} // TODO
    />
  );
};

export default OnboardingService;
