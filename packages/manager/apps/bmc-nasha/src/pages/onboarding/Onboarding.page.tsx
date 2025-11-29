import { useContext, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import {
  ButtonType,
  PageLocation,
  ShellContext,
  useNavigationGetUrl,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { LinkCard, OnboardingLayout } from '@ovh-ux/muk';

import { ONBOARDING_GUIDES } from '@/App.constants';
import { APP_NAME } from '@/Tracking.constants';
import { useOnboardingContent } from '@/hooks/onboarding/useOnboardingData';

import onboardingImage from '../../assets/onboarding-instance.png';

const PREFIX_TRACKING_ONBOARDING = 'onboarding';
const PREFIX_TRACKING_ONBOARDING_GUIDES = 'onboarding::documentation';

export default function OnboardingPage() {
  const { t } = useTranslation(['onboarding', 'common']);
  const { trackClick } = useOvhTracking();
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const { productName, heroImage, tiles } = useOnboardingContent();

  // Get order URL
  const { data: orderUrl } = useNavigationGetUrl(['dedicated', 'nasha/order', {}]);

  // Build guides tiles with localized links
  const guideTiles = useMemo(() => {
    if (!Array.isArray(tiles) || tiles.length === 0) {
      return [];
    }

    return tiles
      .map((tile) => {
        const guideLinks = ONBOARDING_GUIDES[tile.key as keyof typeof ONBOARDING_GUIDES];
        const link = guideLinks?.[ovhSubsidiary as keyof typeof guideLinks] || guideLinks?.WW || '';

        return {
          id: tile.id,
          texts: {
            title: t(`onboarding:${tile.key}_title`, tile.key),
            description: t(`onboarding:${tile.key}_content`, ''),
            category: t('onboarding:tutorial', 'Tutorial'),
          },
          href: link,
          tracking: `${PREFIX_TRACKING_ONBOARDING_GUIDES}::${tile.key}`,
        };
      })
      .filter((tile) => tile.href); // Only include tiles with valid links
  }, [tiles, ovhSubsidiary, t]);

  // Handle order button click
  const handleOrderClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, PREFIX_TRACKING_ONBOARDING, 'add'],
    });
    if (orderUrl) {
      window.location.href = orderUrl as string;
    }
  };

  // Handle guide click tracking
  const handleGuideClick = (tracking: string) => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.externalLink,
      actionType: 'navigation',
      actions: [APP_NAME, tracking],
    });
  };

  // Build hero image
  const img = useMemo(
    () => ({
      src: onboardingImage,
      alt:
        heroImage?.alt ??
        (t('onboarding:hero_alt', { productName: productName || 'NAS-HA' }) ||
          productName ||
          'NAS-HA'),
    }),
    [heroImage, t, productName],
  );

  // Ensure productName is defined
  const displayProductName = productName || 'NAS-HA';

  return (
    <OnboardingLayout
      title={displayProductName}
      img={img}
      description={<p>{t('onboarding:content')}</p>}
      orderButtonLabel={t('onboarding:order')}
      onOrderButtonClick={handleOrderClick}
    >
      {guideTiles.map((tile) => (
        <LinkCard
          key={tile.id}
          href={tile.href}
          texts={tile.texts}
          externalHref
          onClick={() => handleGuideClick(tile.tracking)}
        />
      ))}
    </OnboardingLayout>
  );
}
