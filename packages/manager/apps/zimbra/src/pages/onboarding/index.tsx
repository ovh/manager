import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, OnboardingLayout } from '@ovhcloud/manager-components';
import onboardingImgSrc from './onboarding-img.png';

export default function Onboarding() {
  const { t } = useTranslation('zimbra/onboarding');

  const tileList = [
    {
      id: 1,
      texts: {
        title: t('guide1Title'),
        description: t('guide1Description'),
        category: t('guideCategory'),
      },
      href: 'https://ovh/com/link/1',
    },
    {
      id: 2,
      texts: {
        title: t('guide2Title'),
        description: t('guide2Description'),
        category: t('guideCategory'),
      },
      href: 'https://ovh/com/link/2',
    },
    {
      id: 3,
      texts: {
        title: t('guide3Title'),
        description: t('guide3Description'),
        category: t('guideCategory'),
      },
      href: 'https://ovh/com/link/3',
    },
  ];

  const title: string = t('title');
  const description: string = t('description');

  return (
    <OnboardingLayout
      title={title}
      img={{ src: onboardingImgSrc, width: 450, height: 250 }}
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
  );
}
