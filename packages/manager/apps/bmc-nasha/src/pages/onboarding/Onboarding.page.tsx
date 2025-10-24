import { BaseLayout, Button } from '@ovh-ux/muk';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { ONBOARDING_CONFIG } from '@/App.constants';

export default function OnboardingPage() {
  const { t } = useTranslation('onboarding');
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  const handleOrderClick = () => {
    trackClick({ actions: ['onboarding::add'] });
    // Navigate to order page (to be implemented)
    window.open('https://www.ovhcloud.com/en/bare-metal-cloud/nas-ha/', '_blank');
  };

  const handleGuideClick = (guide: string) => {
    trackClick({ actions: [`onboarding::documentation::${guide}`] });
  };

  return (
    <BaseLayout
      header={{
        title: ONBOARDING_CONFIG.productName,
      }}
    >
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">
            {t('nasha_onboarding_title', {
              defaultValue: `Welcome to ${ONBOARDING_CONFIG.productName}`
            })}
          </h1>

          <p className="text-lg text-gray-600 mb-6">
            {t('nasha_onboarding_content')}
          </p>

          <Button
            variant="primary"
            onClick={handleOrderClick}
          >
            {t('nasha_onboarding_order')}
          </Button>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">
            {t('nasha_onboarding_guides_title', { defaultValue: 'Guides' })}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ONBOARDING_CONFIG.tiles.map((tile) => (
              <div key={tile.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2">
                  {t(`nasha_onboarding_${tile.key}_title`)}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t(`nasha_onboarding_${tile.key}_content`)}
                </p>
                <a
                  href={ONBOARDING_CONFIG.links[tile.linkKey as keyof typeof ONBOARDING_CONFIG.links]}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleGuideClick(tile.key)}
                  className="text-blue-600 hover:underline"
                >
                  Learn more →
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
