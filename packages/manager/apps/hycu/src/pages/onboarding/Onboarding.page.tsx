import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, OnboardingLayout } from '@ovh-ux/manager-react-components';
import { useNavigate } from 'react-router-dom';
import useGuideUtils from '@/hooks/guide/useGuideUtils';
import onboardingImgSrc from './hycu-x-ovhcloud.svg';
import HYCU_CONFIG from '@/hycu.config';
import { urls } from '@/routes/routes.constant';

export default function Onboarding() {
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
    },
    {
      id: 2,
      texts: {
        title: t('hycu_onboarding_guide2_title'),
        description: t('hycu_onboarding_guide2_description'),
        category: t('hycu_onboarding_category_tutorial'),
      },
      href: link?.guideLink2,
    },
    {
      id: 3,
      texts: {
        title: t('hycu_onboarding_guide3_title'),
        description: t('hycu_onboarding_guide3_description'),
        category: t('hycu_onboarding_category_tutorial'),
      },
      href: link?.guideLink3,
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
        navigate(urls.order);
      }}
      moreInfoButtonLabel={t('moreInfoButtonLabel')}
      moreInfoHref={link?.main}
    >
      {tileList.map((tile) => (
        <Card key={tile.id} href={tile.href} texts={tile.texts} />
      ))}
    </OnboardingLayout>
  );
}
