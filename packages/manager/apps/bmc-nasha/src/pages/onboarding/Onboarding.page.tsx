import { useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Card, OnboardingLayout, Text } from '@ovh-ux/muk';

import { useGuideLinks, useOnboardingContent } from '@/hooks/onboarding/useOnboardingData';
import type { OnboardingLinksType } from '@/types/Onboarding.type';

// Image will be copied to assets folder or imported from a shared location
// For now, using a placeholder path that should be updated
const instanceImage = '/assets/images/nasha/instance.png';

export default function OnboardingPage() {
  const { t } = useTranslation(['onboarding', 'common']);
  const navigate = useNavigate();
  const { productName, productCategory, brand, title, heroImage, tiles } = useOnboardingContent();
  const links: OnboardingLinksType = useGuideLinks();

  // Build localized description paragraph
  const description = useMemo(
    () => (
      <Text preset="paragraph" className="text-center">
        {t('onboarding:content', { productName, productCategory, brand })}
      </Text>
    ),
    [t, productName, productCategory, brand],
  );

  // Build hero image object with fallback to instance image
  const img = useMemo(
    () =>
      heroImage?.src
        ? { src: heroImage.src, alt: heroImage.alt ?? t('onboarding:heroAlt', { productName }) }
        : { src: instanceImage, alt: t('onboarding:heroAlt', { productName }) },
    [heroImage, t, productName],
  );

  // Filter tiles to include only those with matching guide links
  const validTiles = useMemo(
    () => tiles.filter(({ linkKey }) => Boolean(links[linkKey])),
    [tiles, links],
  );

  const handleOrderClick = () => {
    // Navigate to order page (to be implemented)
    // For now, we'll use a placeholder navigation
    navigate('../order');
  };

  const handleGuideClick = (linkKey: keyof OnboardingLinksType) => {
    const link = links[linkKey];
    if (link) {
      window.open(link, '_blank');
    }
  };

  return (
    <OnboardingLayout
      title={title ?? productName}
      img={img}
      description={description}
      orderButtonLabel={t('onboarding:order')}
      onOrderButtonClick={handleOrderClick}
    >
      {validTiles.map((tile) => (
        <Card
          key={tile.id}
          href={links[tile.linkKey]}
          texts={{
            title: t(`onboarding:${tile.key}_title`),
            description: t(`onboarding:${tile.key}_content`),
            category: t('onboarding:guideCategory', 'GUIDE'),
          }}
          onClick={() => handleGuideClick(tile.linkKey)}
        />
      ))}
    </OnboardingLayout>
  );
}
