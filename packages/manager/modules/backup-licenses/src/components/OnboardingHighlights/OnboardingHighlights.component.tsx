import React from 'react';

import { Trans, useTranslation } from 'react-i18next';

import { ODS_BADGE_COLOR, ODS_BADGE_SIZE, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsBadge, OdsText } from '@ovhcloud/ods-components/react';

import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';

import OnboardingPricingHighlight from './OnboardingPricingHighlight.component';

export type HighlightKey = 'storage_included' | 'pricing' | 'compatibility';

const COMPATIBILITY_PLATFORMS = ['VMware', 'Windows', 'Linux', 'NAS'];

interface OnboardingHighlightsProps {
  keys: HighlightKey[];
}

export default function OnboardingHighlights({ keys }: OnboardingHighlightsProps) {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.ONBOARDING);

  const renderHighlight = (key: HighlightKey) => {
    if (key === 'compatibility') {
      return (
        <div className="flex items-center justify-center flex-wrap gap-2">
          <OdsText preset={ODS_TEXT_PRESET.caption}>{t('highlights.compatibility')}</OdsText>
          {COMPATIBILITY_PLATFORMS.map((platform) => (
            <OdsBadge
              key={platform}
              label={platform}
              color={ODS_BADGE_COLOR.neutral}
              size={ODS_BADGE_SIZE.sm}
            />
          ))}
        </div>
      );
    }

    if (key === 'pricing') {
      return <OnboardingPricingHighlight />;
    }

    return (
      <OdsText preset={ODS_TEXT_PRESET.caption} className="block text-center leading-tight">
        <Trans i18nKey={`highlights.${key}`} t={t} components={{ b: <b /> }} />
      </OdsText>
    );
  };

  return (
    <ul className="flex flex-col items-center gap-1 list-none p-0 m-0">
      {keys.map((key) => (
        <li key={key}>{renderHighlight(key)}</li>
      ))}
    </ul>
  );
}
