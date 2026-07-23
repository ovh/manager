import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_BADGE_COLOR, ODS_BADGE_SIZE, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsBadge, OdsText } from '@ovhcloud/ods-components/react';

import RadioIndicator from '@/components/order/RadioIndicator/RadioIndicator.component';
import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';
import { Location } from '@/types/Location.type';
import { formatLocationTitle, getFlagEmoji } from '@/utils/locationLabel/locationLabel';
import { SELECTED_CARD_CLASS } from '@/utils/orderAccent/orderAccent';

interface RegionCardProps {
  location: Location;
  selected: boolean;
  onSelect: () => void;
}

/** Carte de localisation du Vault (étape 3) — sélectionnable, comportement radio. */
export default function RegionCard({ location, selected, onSelect }: RegionCardProps) {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.ORDER);

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`flex cursor-pointer flex-col gap-4 rounded-lg border-2 bg-white p-6 text-left transition-[border-color,box-shadow] ${
        selected
          ? SELECTED_CARD_CLASS
          : 'border-[var(--ods-color-neutral-200)] hover:border-[var(--ods-color-primary-200)]'
      }`}
    >
      <span className="flex items-center justify-between">
        <span aria-hidden="true" className="text-xl leading-none">
          {getFlagEmoji(location.countryCode)}
        </span>
        <RadioIndicator selected={selected} />
      </span>
      <OdsText preset={ODS_TEXT_PRESET.paragraph} className="font-semibold">
        {formatLocationTitle(t, location)}
      </OdsText>
      <OdsText preset={ODS_TEXT_PRESET.caption} className="text-[var(--ods-color-neutral-500)]">
        {location.geographyName}
      </OdsText>
      <span>
        <OdsBadge label={location.name} color={ODS_BADGE_COLOR.neutral} size={ODS_BADGE_SIZE.sm} />
      </span>
    </button>
  );
}
