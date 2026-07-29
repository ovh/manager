import React, { useState } from 'react';

import VdpTierAccordionItem from '@/components/edit/VdpTierAccordionItem/VdpTierAccordionItem.component';
import { VDP_TIER_CARDS } from '@/data/licenses.data';
import { VdpTier } from '@/types/Order.type';
import { sortByRecommended } from '@/utils/sortByRecommended/sortByRecommended';

const SORTED_CARDS = sortByRecommended(VDP_TIER_CARDS);
const DEFAULT_OPEN_TIER =
  SORTED_CARDS.find((card) => card.recommended)?.tier ?? SORTED_CARDS[0]!.tier;

interface VdpTierAccordionGroupProps {
  groupLabel: string;
  selectedTier: VdpTier | null;
  onSelectTier: (tier: VdpTier) => void;
  className?: string;
}

/**
 * Groupe d'accordéons des niveaux Veeam Data Platform (modale d'édition, BKP-1218) : la
 * recommandation est triée en tête et dépliée par défaut. Ouvrir une carte la sélectionne aussi
 * (un seul geste), la replier ne change pas la sélection en cours.
 */
export default function VdpTierAccordionGroup({
  groupLabel,
  selectedTier,
  onSelectTier,
  className = '',
}: VdpTierAccordionGroupProps) {
  const [openTier, setOpenTier] = useState<VdpTier | null>(DEFAULT_OPEN_TIER);

  const handleToggle = (tier: VdpTier, isOpen: boolean) => {
    if (isOpen) {
      setOpenTier(tier);
      onSelectTier(tier);
    } else if (openTier === tier) {
      setOpenTier(null);
    }
  };

  return (
    <div aria-label={groupLabel} className={`flex flex-col gap-3 ${className}`}>
      {SORTED_CARDS.map((card) => (
        <VdpTierAccordionItem
          key={card.tier}
          card={card}
          selected={selectedTier === card.tier}
          isOpen={openTier === card.tier}
          onToggle={(isOpen) => handleToggle(card.tier, isOpen)}
        />
      ))}
    </div>
  );
}
