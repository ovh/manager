import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, OnboardingLayout } from '@ovh-ux/manager-react-components';
import useGuides from '@/hooks/guides/useGuides';
import onboardingImgSrc from './onboarding-img.png';

export default function Onboarding() {
  const { t } = useTranslation('onboarding');
  const guides = useGuides();

  const tiles = useMemo(
    () => [
      {
        id: 1,
        texts: {
          title: t(guides?.guideLink1?.title),
          description: t(guides?.guideLink1?.description),
          category: t(guides?.guideLink1?.category),
        },
        href: guides?.guideLink1?.href,
      },
      {
        id: 2,
        texts: {
          title: t(guides?.guideLink2?.title),
          description: t(guides?.guideLink2?.description),
          category: t(guides?.guideLink2?.category),
        },
        href: guides?.guideLink2?.href,
      },
      {
        id: 3,
        texts: {
          title: t(guides?.guideLink3?.title),
          description: t(guides?.guideLink3?.description),
          category: t(guides?.guideLink13.category),
        },
        href: guides?.guideLink3?.href,
      },
    ],
    [guides],
  );

  return (
    <>
      <OnboardingLayout
        title={t('title')}
        img={{ src: onboardingImgSrc }}
        description={t('description')}
        orderButtonLabel={t('orderButtonLabel')}
        orderHref={t('orderButtonLink')}
        moreInfoButtonLabel={t('moreInfoButtonLabel')}
        moreInfoHref={t('moreInfoButtonLink')}
      >
        {tiles.map((tile) => (
          <Card key={tile.id} href={tile.href} texts={tile.texts} />
        ))}
      </OnboardingLayout>
    </>
  );
}
