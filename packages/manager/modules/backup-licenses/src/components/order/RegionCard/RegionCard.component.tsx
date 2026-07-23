import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_BADGE_COLOR, ODS_BADGE_SIZE, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsBadge, OdsText } from '@ovhcloud/ods-components/react';

import RadioIndicator from '@/components/order/RadioIndicator/RadioIndicator.component';
import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';
import { VaultRegionData } from '@/types/Order.type';
import { SELECTED_CARD_CLASS } from '@/utils/orderAccent/orderAccent';

interface RegionCardProps {
  region: VaultRegionData;
  selected: boolean;
  onSelect: () => void;
}

/** Carte de région du Vault (étape 3) — sélectionnable, comportement radio. */
export default function RegionCard({ region, selected, onSelect }: RegionCardProps) {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.ORDER);
  const base = `region.${region.i18nKey}`;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`flex cursor-pointer flex-col gap-4 rounded-lg border-2 bg-white p-6 text-left transition-[border-color,box-shadow] hover:border-[var(--ods-color-primary-200)] ${
        selected ? SELECTED_CARD_CLASS : 'border-[var(--ods-color-neutral-200)]'
      }`}
    >
      <span className="flex items-center justify-between">
        <span aria-hidden="true" className="text-xl leading-none">
          {region.flag}
        </span>
        <RadioIndicator selected={selected} />
      </span>
      <OdsText preset={ODS_TEXT_PRESET.paragraph} className="font-semibold">
        {t(`${base}.name`)}
      </OdsText>
      <OdsText preset={ODS_TEXT_PRESET.caption} className="text-[var(--ods-color-neutral-500)]">
        {t(`${base}.zone`)}
      </OdsText>
      <span>
        <OdsBadge
          label={region.apiValue}
          color={ODS_BADGE_COLOR.neutral}
          size={ODS_BADGE_SIZE.sm}
        />
      </span>
    </button>
  );
}
