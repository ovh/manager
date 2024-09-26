import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { OnboardingLayout } from '@ovh-ux/manager-react-components';
import { useNavigate } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import onboardingImgSrc from './onboarding-img.png';
import { SAVINGS_PLAN_INFO_URL } from '../../constants';

export default function Onboarding() {
  const { t } = useTranslation('onboarding');
  const navigate = useNavigate();

  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const savingsPlanUrl =
    SAVINGS_PLAN_INFO_URL[
      ovhSubsidiary as keyof typeof SAVINGS_PLAN_INFO_URL
    ] || SAVINGS_PLAN_INFO_URL.DEFAULT;

  return (
    <OnboardingLayout
      title={t('title')}
      img={{
        src: onboardingImgSrc,
      }}
      description={t('description')}
      orderButtonLabel={t('orderButtonLabel')}
      onOrderButtonClick={() => navigate('../new')}
      moreInfoButtonLabel={t('moreInfoButtonLabel')}
      moreInfoHref={savingsPlanUrl}
    />
  );
}
