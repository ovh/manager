import React, { Suspense, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { OdsText } from '@ovhcloud/ods-components/react';

import { BaseLayout, ManagerButton } from '@ovh-ux/manager-react-components';

import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import OnboardingLayout from '@/components/OnboardingLayout/OnboardingLayout';
import NashaCreateModal from '@/components/NashaCreateModal/NashaCreateModal';
import { GUIDES, NASHA_TITLE, PREFIX_TRACKING_ONBOARDING, PREFIX_TRACKING_ONBOARDING_GUIDES } from '@/constants/onboarding.constants';
import { urls } from '@/routes/Routes.constants';

// Import the illustration - we'll use a placeholder for now
const illustration = 'https://via.placeholder.com/400x300/0066cc/ffffff?text=NAS-HA';

export default function OnboardingPage() {
  const { t } = useTranslation('onboarding');
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Prepare guides with translations
  const guides = GUIDES.map((guide) => ({
    ...guide,
    title: t(`nasha_onboarding_${guide.id}_title`),
    description: t(`nasha_onboarding_${guide.id}_content`),
    // For now, we'll use the FR link as default - in a real app, you'd get the user's locale
    link: guide.link.FR || guide.link.WW,
  }));

  const handleOrderClick = () => {
    trackClick({
      location: 'page' as any,
      buttonType: 'button' as any,
      actionType: 'navigation' as any,
      actions: [`${PREFIX_TRACKING_ONBOARDING}::add`]
    });
    setIsCreateModalOpen(true);
  };

  const handleGuideClick = (guide: any) => {
    trackClick({
      location: 'page' as any,
      buttonType: 'externalLink' as any,
      actionType: 'navigation' as any,
      actions: [`${PREFIX_TRACKING_ONBOARDING_GUIDES}::${guide.hitSuffix}`]
    });
    window.open(guide.link, '_blank');
  };

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    // Navigate to listing page after modal closes (assuming success)
    navigate(urls.root);
  };

  return (
    <BaseLayout>
      <OnboardingLayout
        guides={guides}
        onGuideClick={handleGuideClick}
        imageSource={illustration}
      >
        {/* Title */}
        <div className="text-center mb-6">
          <OdsText preset="heading-1">
            {NASHA_TITLE}
          </OdsText>
        </div>

        {/* Description */}
        <div className="text-center space-y-4">
          <OdsText preset="paragraph" color="neutral-600">
            {t('nasha_onboarding_content')}
          </OdsText>
          <ManagerButton
            id="order-nasha"
            label={t('nasha_onboarding_order')}
            iamActions={['nasha:create']}
            onClick={handleOrderClick}
          />
        </div>
      </OnboardingLayout>

      {/* Create Service Modal */}
      <Suspense fallback={null}>
        <NashaCreateModal
          isOpen={isCreateModalOpen}
          onClose={handleModalClose}
        />
      </Suspense>
    </BaseLayout>
  );
}
