import React from 'react';

import RegionSelector from '@/components/order/RegionSelector/RegionSelector.component';

interface LocationStepProps {
  selected: string | null;
  isDisabled?: boolean;
  onSelect: (apiValue: string) => void;
}

/** Étape ③ — localisation du Vault. Pas de CTA propre : le CTA de commande vit dans le récap. */
export default function LocationStep({
  selected,
  isDisabled = false,
  onSelect,
}: LocationStepProps) {
  return (
    <section>
      <RegionSelector selected={selected} isDisabled={isDisabled} onSelect={onSelect} />
    </section>
  );
}
