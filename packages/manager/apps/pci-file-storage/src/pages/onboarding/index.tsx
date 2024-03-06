import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, OnboardingLayout } from '@ovhcloud/manager-components';
import useGuideUtils from '@/components/GuideLink/guide-utils';
import onboardingImgSrc from './onboarding-img.png';

export default function Onboarding() {
  const { t } = useTranslation('pci-file-storage/onboarding');
  const link = useGuideUtils();

  const tileList = [
    {
      texts: {
        title: t('guide1Title'),
        description: t('guide1Description'),
        category: t('guideCategory'),
      },
      href: link?.guideLink1,
    },
    {
      texts: {
        title: t('guide2Title'),
        description: t('guide2Description'),
        category: t('guideCategory'),
      },
      href: link?.guideLink2,
    },
    {
      texts: {
        title: t('guide3Title'),
        description: t('guide3Description'),
        category: t('guideCategory'),
      },
      href: link?.guideLink3,
    },
  ];

  const title: string = t('title');
  const description: string = t('description');
  const imgSrc = {
    src: onboardingImgSrc,
  };

  return (
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
          <Card href={tile.href} texts={tile.texts} />
        ))}
      </aside>
    </OnboardingLayout>
  );
}
