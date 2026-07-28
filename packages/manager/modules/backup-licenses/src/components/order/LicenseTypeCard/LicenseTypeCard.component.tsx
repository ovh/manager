import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_BADGE_COLOR, ODS_BADGE_SIZE, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsBadge, OdsDivider, OdsText } from '@ovhcloud/ods-components/react';

import FeatureList from '@/components/order/FeatureList/FeatureList.component';
import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';
import { LicenseCardData } from '@/types/Order.type';
import { SELECTED_CARD_CLASS } from '@/utils/orderAccent/orderAccent';

interface LicenseTypeCardProps {
  card: LicenseCardData;
  selected: boolean;
  onSelect: () => void;
}

/** Carte de type de licence (étape 1) — sélectionnable, comportement radio. */
export default function LicenseTypeCard({ card, selected, onSelect }: LicenseTypeCardProps) {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.ORDER);
  const base = `license.${card.i18nKey}`;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[10px] border-2 border-solid bg-white text-left transition-[border-color,box-shadow] hover:border-[var(--ods-color-primary-500)] ${
        selected ? SELECTED_CARD_CLASS : 'border-[var(--ods-color-neutral-200)]'
      }`}
    >
      {card.recommended && (
        <span className="absolute right-6 top-6 z-10">
          <OdsBadge
            label={t('badge.recommended')}
            color={ODS_BADGE_COLOR.information}
            size={ODS_BADGE_SIZE.sm}
          />
        </span>
      )}
      <span className="flex flex-1 flex-col gap-6 p-8">
        <OdsText preset={ODS_TEXT_PRESET.heading6}>{t(`${base}.title`)}</OdsText>
        <OdsText preset={ODS_TEXT_PRESET.caption} className="text-[var(--ods-color-neutral-600)]">
          {t(`${base}.price`)}
        </OdsText>
        <span className="flex flex-wrap gap-4">
          <OdsBadge
            label={t(`${base}.tag_vbr`)}
            color={ODS_BADGE_COLOR.neutral}
            size={ODS_BADGE_SIZE.sm}
          />
          <OdsBadge
            label={t(`${base}.tag_os`)}
            color={ODS_BADGE_COLOR.neutral}
            size={ODS_BADGE_SIZE.sm}
          />
        </span>
        <OdsDivider className="my-4" />
        <FeatureList idPrefix={`feat-${card.i18nKey}`} features={card.features} withTooltips />
      </span>
    </button>
  );
}
