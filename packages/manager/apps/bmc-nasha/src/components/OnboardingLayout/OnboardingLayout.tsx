import React from 'react';

import { useTranslation } from 'react-i18next';

import { OdsCard, OdsIcon, OdsText } from '@ovhcloud/ods-components/react';

import { ODS_ICON_NAME } from '@ovhcloud/ods-components';

import { ManagerButton } from '@ovh-ux/manager-react-components';

interface Guide {
  id: string;
  title: string;
  description: string;
  link: string;
  hitSuffix: string;
}

interface OnboardingLayoutProps {
  guides: Guide[];
  onGuideClick: (guide: Guide) => void;
  imageSource: string;
  children: React.ReactNode;
}

export default function OnboardingLayout({
  guides,
  onGuideClick,
  imageSource,
  children,
}: OnboardingLayoutProps) {
  const { t } = useTranslation('onboarding');

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Content */}
        <div className="space-y-6">
          {children}
        </div>

        {/* Right side - Image and Guides */}
        <div className="space-y-6">
          {/* Illustration */}
          <div className="text-center">
            <img
              src={imageSource}
              alt="NAS-HA Illustration"
              className="max-w-full h-auto mx-auto"
              style={{ maxHeight: '300px' }}
            />
          </div>

          {/* Guides */}
          <div className="space-y-4">
            <OdsText preset="heading-3" className="text-center">
              {t('guides_title', 'Guides')}
            </OdsText>

            <div className="grid grid-cols-1 gap-4">
              {guides.map((guide) => (
                <OdsCard key={guide.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <OdsIcon name={ODS_ICON_NAME.book} className="flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <OdsText preset="heading-4" className="mb-2">
                        {guide.title}
                      </OdsText>
                      <OdsText preset="paragraph" color="neutral-600" className="mb-3">
                        {guide.description}
                      </OdsText>
                      <ManagerButton
                        id={`guide-${guide.id}`}
                        label={t('read_guide', 'Lire le guide')}
                        variant="ghost"
                        onClick={() => onGuideClick(guide)}
                      />
                    </div>
                  </div>
                </OdsCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
