import React from 'react';

import RegionSelector from '@/components/order/RegionSelector/RegionSelector.component';

interface LocationStepProps {
  selected: string | null;
  onSelect: (apiValue: string) => void;
}

/** Étape ③ — localisation du Vault. Pas de CTA propre : le CTA de commande vit dans le récap. */
export default function LocationStep({ selected, onSelect }: LocationStepProps) {
  return (
    <section>
      <RegionSelector selected={selected} onSelect={onSelect} />
    </section>
  );
}
