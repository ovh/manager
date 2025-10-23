import React from 'react';

import { useTranslation } from 'react-i18next';

import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { OnboardingLayout } from '@ovh-ux/manager-react-components';

import { LABELS } from '@/utils/labels.constants';
import { ONBOARDING_IMG_SRC } from '@/utils/onboarding.constants';

const OnboardingService: React.FC = () => {
  const { t } = useTranslation(['metrics', NAMESPACES.ONBOARDING]);
  return (
    <OnboardingLayout
      title={LABELS.TENANT}
      description={
        <OdsText preset="paragraph" className="text-center">
          {t('metrics:onboarding.description')}
        </OdsText>
      }
      img={ONBOARDING_IMG_SRC}
      orderButtonLabel={t('metrics:onboarding.orderButtonLabel')}
      orderHref="https://www.ovh.com" // TODO
      moreInfoButtonLabel={t(`${NAMESPACES.ONBOARDING}:find_out_more`)}
      moreInfoHref={'https://www.ovh.com'} // TODO
    />
  );
};

export default OnboardingService;
