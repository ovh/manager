import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, OnboardingLayout } from '@ovh-ux/manager-react-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import useGuideUtils from '@/hooks/guide/useGuideUtils';
import onboardingImgSrc from './hycu-x-ovhcloud.svg';
import HYCU_CONFIG from '@/hycu.config';
import { urls } from '@/routes/routes.constant';
import { TRACKING } from '@/tracking.constant';

export default function Onboarding() {
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const { t } = useTranslation('hycu/onboarding');
  const { t: tCommon } = useTranslation('hycu');
  const link = useGuideUtils();

  const tileList = [
    {
      id: 1,
      texts: {
        title: t('hycu_onboarding_guide1_title'),
        description: t('hycu_onboarding_guide1_description'),
        category: t('hycu_onboarding_category_tutorial'),
      },
      href: link?.guideLink1,
      tracking: 'guides-documentation',
    },
    {
      id: 2,
      texts: {
        title: t('hycu_onboarding_guide2_title'),
        description: t('hycu_onboarding_guide2_description'),
        category: t('hycu_onboarding_category_tutorial'),
      },
      href: link?.guideLink2,
      tracking: 'nutanix',
    },
    {
      id: 3,
      texts: {
        title: t('hycu_onboarding_guide3_title'),
        description: t('hycu_onboarding_guide3_description'),
        category: t('hycu_onboarding_category_tutorial'),
      },
      href: link?.guideLink3,
      tracking: 'disaster-recovery-plan',
    },
  ];

  const title: string = HYCU_CONFIG.rootLabel;
  const description: string = tCommon('hycu_description');
  const imgSrc: React.ComponentProps<'img'> = {
    src: onboardingImgSrc,
    className: 'max-h-36 w-max-w-9/12',
  };

  return (
    <OnboardingLayout
      title={title}
      img={imgSrc}
      description={description}
      orderButtonLabel={t('orderButtonLabel')}
      onOrderButtonClick={() => {
        trackClick(TRACKING.onboarding.beginClick);
        navigate(urls.order);
      }}
      moreInfoButtonLabel={t('moreInfoButtonLabel')}
      moreInfoHref={link?.main}
      onmoreInfoButtonClick={() => {
        trackClick(TRACKING.onboarding.moreInfoClick);
      }}
    >
      {tileList.map((tile) => (
        <Card
          key={tile.id}
          href={tile.href}
          texts={tile.texts}
          onClick={() => {
            trackClick(TRACKING.onboarding.guideClick(tile.tracking));
          }}
        />
      ))}
    </OnboardingLayout>
  );
}
