import { OnboardingLayout, LinkCard } from '@ovh-ux/muk';
import { useTranslation } from 'react-i18next';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { ONBOARDING_CONFIG } from '@/App.constants';
import nashaIcon from '@/assets/images/nasha-icon.png';

export default function OnboardingPage() {
  const { t } = useTranslation('onboarding');
  const { trackClick } = useOvhTracking();

  const handleOrderClick = () => {
    trackClick({ actions: ['onboarding::add'] });
    // Navigate to order page (to be implemented)
    window.open(
      'https://www.ovhcloud.com/en/bare-metal-cloud/nas-ha/',
      '_blank',
    );
  };

  const handleGuideClick = (guide: string) => {
    trackClick({ actions: [`onboarding::documentation::${guide}`] });
  };

  return (
    <OnboardingLayout
      title={ONBOARDING_CONFIG.productName}
      description={
        <p className="text-lg text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
          {t('nasha_onboarding_content')}
        </p>
      }
      orderButtonLabel={t('nasha_onboarding_order')}
      onOrderButtonClick={handleOrderClick}
      orderIam={{
        urn: 'urn:v1:eu:product:nasha',
        iamActions: ['product:create'],
        displayTooltip: true,
      }}
      img={{
        src: nashaIcon,
        alt: 'NAS-HA Service',
        className: 'w-32 h-32 object-contain mx-auto',
      }}
    >
      {/* Tutorials Section */}
      {ONBOARDING_CONFIG.tiles.map((tile) => (
        <LinkCard
          key={tile.id}
          href={
            ONBOARDING_CONFIG.links[
              tile.linkKey as keyof typeof ONBOARDING_CONFIG.links
            ]
          }
          externalHref={true}
          texts={{
            title: t(`nasha_onboarding_${tile.key}_title`),
            description: t(`nasha_onboarding_${tile.key}_content`),
            category: 'Tutoriel',
          }}
          onClick={() => handleGuideClick(tile.key)}
        />
      ))}
    </OnboardingLayout>
  );
}
