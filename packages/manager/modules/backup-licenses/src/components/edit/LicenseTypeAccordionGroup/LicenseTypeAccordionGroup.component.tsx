import React, { useState } from 'react';

import LicenseTypeAccordionItem from '@/components/edit/LicenseTypeAccordionItem/LicenseTypeAccordionItem.component';
import { LICENSE_CARDS } from '@/data/licenses.data';
import { LicenseFamily } from '@/types/Order.type';
import { sortByRecommended } from '@/utils/sortByRecommended/sortByRecommended';

const SORTED_CARDS = sortByRecommended(LICENSE_CARDS);
const DEFAULT_OPEN_FAMILY =
  SORTED_CARDS.find((card) => card.recommended)?.family ?? SORTED_CARDS[0]!.family;

interface LicenseTypeAccordionGroupProps {
  groupLabel: string;
  selectedFamily: LicenseFamily;
  onSelectFamily: (family: LicenseFamily) => void;
  className?: string;
}

/**
 * Groupe d'accordéons des familles de licence (modale d'édition, BKP-1218) : la recommandation
 * est triée en tête et dépliée par défaut. Ouvrir une carte la sélectionne aussi (un seul geste),
 * la replier ne change pas la sélection en cours.
 */
export default function LicenseTypeAccordionGroup({
  groupLabel,
  selectedFamily,
  onSelectFamily,
  className = '',
}: LicenseTypeAccordionGroupProps) {
  const [openFamily, setOpenFamily] = useState<LicenseFamily | null>(DEFAULT_OPEN_FAMILY);

  const handleToggle = (family: LicenseFamily, isOpen: boolean) => {
    if (isOpen) {
      setOpenFamily(family);
      onSelectFamily(family);
    } else if (openFamily === family) {
      setOpenFamily(null);
    }
  };

  return (
    <div aria-label={groupLabel} className={`flex flex-col gap-3 ${className}`}>
      {SORTED_CARDS.map((card) => (
        <LicenseTypeAccordionItem
          key={card.family}
          card={card}
          selected={selectedFamily === card.family}
          isOpen={openFamily === card.family}
          onToggle={(isOpen) => handleToggle(card.family, isOpen)}
        />
      ))}
    </div>
  );
}
