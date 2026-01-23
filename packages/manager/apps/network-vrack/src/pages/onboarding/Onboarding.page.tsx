import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { LinkCard, OnboardingLayout, Text } from '@ovh-ux/muk';

import { useGuideLinks, useOnboardingContent } from '@/hooks/onboarding/useOnboardingData';
import { OnboardingLinksType } from '@/types/Onboarding.type';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

export default function OnboardingPage() {
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.onboarding,
    NAMESPACES.ACTIONS,
    NAMESPACES.ONBOARDING,
  ]);
  const { productName, productCategory, brand, title, heroImage, tiles } = useOnboardingContent();
  const links: OnboardingLinksType = useGuideLinks();

  // Build localized description paragraph.
  const description = useMemo(
    () => (
      <section className="text-center">
        <Text className="my-6 block">
          {t('onboarding:description_part1', {
            productName,
            productCategory,
            brand,
          })}
        </Text>
        <Text>{t('onboarding:description_part2', { productName })}</Text>
      </section>
    ),
    [t, productName, productCategory, brand],
  );

  // Build hero image object with fallback alt text.
  const img = useMemo(
    () =>
      heroImage
        ? {
            src: heroImage.src,
            alt: heroImage.alt ?? t('onboarding:hero_alt', { productName }),
          }
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
      orderButtonLabel={t(`${NAMESPACES.ACTIONS}:start`)}
      onOrderButtonClick={() => {}}
      moreInfoButtonLabel={t(`${NAMESPACES.ONBOARDING}:more_infos`)}
    >
      {validTiles.map(({ id, key, linkKey }) => {
        const href = links[linkKey];
        if (!href) return null;

        return (
          <LinkCard
            key={id}
            href={href}
            texts={{
              title: t(`onboarding:guides.${key}.title`, { productName }),
              description: t(`onboarding:guides.${key}.description`, {
                productName,
              }),
              category: t(`onboarding:guides.${key}.category`),
            }}
            hrefLabel={t(`onboarding:guides.${key}.cta`)}
          />
        );
      })}
    </OnboardingLayout>
  );
}
