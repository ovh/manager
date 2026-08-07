import React from 'react';

import { Trans, useTranslation } from 'react-i18next';

import { ODS_BADGE_COLOR, ODS_BADGE_SIZE, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsBadge, OdsDivider, OdsText } from '@ovhcloud/ods-components/react';

import CardPrice from '@/components/order/CardPrice/CardPrice.component';
import FeatureList from '@/components/order/FeatureList/FeatureList.component';
import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';
import { VdpTierCardData } from '@/types/Order.type';
import { SELECTED_CARD_CLASS } from '@/utils/orderAccent/orderAccent';

interface VdpTierCardProps {
  card: VdpTierCardData;
  selected: boolean;
  /** Carte non sélectionnable (édition restreinte par la version/l'OS du serveur, cf. `licenseEditRules`). */
  disabled?: boolean;
  onSelect: () => void;
}

/** Carte de niveau Veeam Data Platform (sous-bloc de l'étape ①) — sélectionnable, comportement radio. */
export default function VdpTierCard({
  card,
  selected,
  disabled = false,
  onSelect,
}: VdpTierCardProps) {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.ORDER);
  const base = `tier.${card.i18nKey}`;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={disabled ? undefined : onSelect}
      className={`relative flex h-full flex-col overflow-hidden rounded-[10px] border-2 bg-white p-0 text-left transition-[border-color,box-shadow] ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      } ${
        selected
          ? SELECTED_CARD_CLASS
          : disabled
            ? 'border-[var(--ods-color-neutral-200)] opacity-50'
            : 'border-[var(--ods-color-neutral-200)] hover:border-[var(--ods-color-primary-500)]'
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
        <OdsText
          preset={ODS_TEXT_PRESET.caption}
          className="[--ods-color-text:var(--ods-color-neutral-600)]"
        >
          <Trans i18nKey={`${base}.audience`} t={t} components={{ b: <b /> }} />
        </OdsText>
        <OdsDivider className="my-4" />
        <FeatureList idPrefix={`tier-${card.i18nKey}`} features={card.features} />
      </span>
      <OdsDivider className="m-0" />
      <span className="block bg-[var(--ods-color-neutral-050)] p-8">
        <CardPrice planCode={card.planCode} i18nBase={base} />
      </span>
    </button>
  );
}
