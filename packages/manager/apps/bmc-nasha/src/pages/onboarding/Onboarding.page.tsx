import { OnboardingLayout } from '@ovh-ux/muk';
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
        <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
          {t('nasha_onboarding_content')}
        </p>
      }
      orderButtonLabel={t('nasha_onboarding_order')}
      onOrderButtonClick={handleOrderClick}
      img={{
        src: nashaIcon,
        alt: 'NAS-HA Service',
        className: 'w-40 h-40 object-contain',
      }}
    >
      {/* Tutorials Section */}
      <div className="row pt-5">
        {ONBOARDING_CONFIG.tiles.map((tile) => (
          <div key={tile.id} className="col-md-6 col-lg-4 mb-4">
            <a
              className="py-2 oui-tile d-flex align-items-start p-3"
              target="_blank"
              rel="noopener"
              href={
                ONBOARDING_CONFIG.links[
                  tile.linkKey as keyof typeof ONBOARDING_CONFIG.links
                ]
              }
              onClick={() => handleGuideClick(tile.key)}
            >
              <div className="ml-2">
                <h5 className="guide-title">Tutoriel</h5>
                <h3 className="font-weight-bold">
                  {t(`nasha_onboarding_${tile.key}_title`)}
                </h3>
                <div className="oui-tile__body mt-3">
                  <p className="oui-tile__description font-weight-normal">
                    {t(`nasha_onboarding_${tile.key}_content`)}
                  </p>
                  <span className="oui-link oui-link_icon">
                    <span>En savoir plus</span>
                    <span
                      className="oui-icon oui-icon-external-link oui-color-p-600"
                      aria-hidden="true"
                    ></span>
                  </span>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
    </OnboardingLayout>
  );
}
