import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import RegionCard from '@/components/order/RegionCard/RegionCard.component';
import { VAULT_REGIONS } from '@/data/regions.data';
import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';

interface RegionSelectorProps {
  selected: string | null;
  onSelect: (apiValue: string) => void;
}

/**
 * Sous-bloc 3 de l'étape 3 : sélection de la région du Vault (grille 3 colonnes).
 * STUB : régions FR en dur (cf. regions.data.ts) — à brancher sur le catalogue Agora.
 */
export default function RegionSelector({ selected, onSelect }: RegionSelectorProps) {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.ORDER);

  return (
    <div>
      <OdsText preset={ODS_TEXT_PRESET.heading5} className="block">
        {t('region.section_title')}
      </OdsText>
      <OdsText
        preset={ODS_TEXT_PRESET.caption}
        className="mb-6 block text-[var(--ods-color-neutral-600)]"
      >
        {t('region.section_subtitle')}
      </OdsText>
      <div
        role="radiogroup"
        aria-label={t('region.section_title')}
        className="grid grid-cols-2 gap-6 sm:grid-cols-3"
      >
        {VAULT_REGIONS.map((region) => (
          <RegionCard
            key={region.apiValue}
            region={region}
            selected={selected === region.apiValue}
            onSelect={() => onSelect(region.apiValue)}
          />
        ))}
      </div>
    </div>
  );
}
