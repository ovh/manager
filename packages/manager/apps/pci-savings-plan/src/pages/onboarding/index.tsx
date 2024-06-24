import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, OnboardingLayout } from '@ovhcloud/manager-components';
import useGuideUtils from '@/hooks/guide/useGuideUtils';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import onboardingImgSrc from './onboarding-img.png';

export default function Onboarding() {
  const { t } = useTranslation('onboarding');
  const link = useGuideUtils();

  const tileList = [
    {
      id: 1,
      texts: {
        title: t('guide1Title'),
        description: t('guide1Description'),
        category: t('guideCategory'),
      },
      href: link?.guideLink1,
    },
  ];

  const title: string = t('title');
  const description: string = t('description');
  const imgSrc = {
    src: onboardingImgSrc,
  };

  return (
    <>
      <OnboardingLayout
        title={title}
        img={imgSrc}
        description={description}
        orderButtonLabel={t('orderButtonLabel')}
        orderHref={t('orderButtonLink')}
        moreInfoButtonLabel={t('moreInfoButtonLabel')}
        moreInfoHref={t('moreInfoButtonLink')}
      >
        <aside className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pt-12">
          {tileList.map((tile) => (
            <Card key={tile.id} href={tile.href} texts={tile.texts} />
          ))}
        </aside>
      </OnboardingLayout>
    </>
  );
}
