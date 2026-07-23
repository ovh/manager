import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import VdpTierCard from '@/components/order/VdpTierCard/VdpTierCard.component';
import { VDP_TIER_CARDS } from '@/data/licenses.data';
import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';
import { VdpTier } from '@/types/Order.type';

interface VdpTierStepProps {
  selected: VdpTier | null;
  onSelect: (tier: VdpTier) => void;
}

/** Étape 2 — choix du niveau Veeam Data Platform (3 cartes). Affichée uniquement si VDP. */
export default function VdpTierStep({ selected, onSelect }: VdpTierStepProps) {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.ORDER);

  return (
    <section>
      <OdsText
        preset={ODS_TEXT_PRESET.paragraph}
        className="mb-8 block text-[var(--ods-color-neutral-600)]"
      >
        {t('step.vdp_tier.subtitle')}
      </OdsText>
      <div
        role="radiogroup"
        aria-label={t('step.vdp_tier.label')}
        className="grid grid-cols-1 gap-6 md:grid-cols-3"
      >
        {VDP_TIER_CARDS.map((card) => (
          <VdpTierCard
            key={card.tier}
            card={card}
            selected={selected === card.tier}
            onSelect={() => onSelect(card.tier)}
          />
        ))}
      </div>
    </section>
  );
}
