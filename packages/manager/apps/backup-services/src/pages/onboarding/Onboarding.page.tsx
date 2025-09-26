import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { OdsText } from '@ovhcloud/ods-components/react';

import { Card, OnboardingLayout } from '@ovh-ux/manager-react-components';

import { useGuideLinks, useOnboardingContent } from '@/hooks/onboarding/useOnboardingData';
import type { OnboardingLinksType } from '@/types/Onboarding.type';

export default function OnboardingPage() {
  const { t } = useTranslation(['onboarding', 'common']);
  const { productName, productCategory, brand, title, heroImage, tiles } = useOnboardingContent();
  const links: OnboardingLinksType = useGuideLinks();

  // Build localized description paragraph.
  const description = useMemo(
    () => (
      <OdsText className="text-center">
        <p>{t('onboarding:description_part1', { productName, productCategory, brand })}</p>
        {t('onboarding:description_part2', { productName })}
      </OdsText>
    ),
    [t, productName, productCategory, brand],
  );

  // Build hero image object with fallback alt text.
  const img = useMemo(
    () =>
      heroImage
        ? { src: heroImage.src, alt: heroImage.alt ?? t('onboarding:hero_alt', { productName }) }
        : undefined,
    [heroImage, t, productName],
  );

  // Filter tiles to include only those with matching guide links.
  const validTiles = useMemo(
    () => tiles.filter(({ linkKey }) => Boolean(links[linkKey])),
    [tiles, links],
  );

  return (
    <OnboardingLayout
      title={title ?? t('onboarding:title_fallback', { productName })}
      img={img}
      description={description}
      orderButtonLabel={t('common:order')}
    >
      {validTiles.map(({ id, key, linkKey }) => {
        const href = links[linkKey];
        if (!href) return null;

        return (
          <Card
            key={id}
            href={href}
            texts={{
              title: t(`onboarding:guides.${key}.title`, { productName }),
              description: t(`onboarding:guides.${key}.description`, { productName }),
              category: t(`onboarding:guides.${key}.category`),
            }}
            hrefLabel={t(`onboarding:guides.${key}.cta`)}
          />
        );
      })}
    </OnboardingLayout>
  );
}
