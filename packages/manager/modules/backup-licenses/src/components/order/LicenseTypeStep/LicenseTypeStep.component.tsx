import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import LicenseTypeCard from '@/components/order/LicenseTypeCard/LicenseTypeCard.component';
import { LICENSE_CARDS } from '@/data/licenses.data';
import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';
import { LicenseFamily } from '@/types/Order.type';

interface LicenseTypeStepProps {
  selected: LicenseFamily | null;
  onSelect: (family: LicenseFamily) => void;
}

/** Étape 1 — choix du type de licence (2 cartes côte à côte). */
export default function LicenseTypeStep({ selected, onSelect }: LicenseTypeStepProps) {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.ORDER);

  return (
    <section>
      <OdsText
        preset={ODS_TEXT_PRESET.paragraph}
        className="mb-8 block text-[var(--ods-color-neutral-600)]"
      >
        {t('step.license_type.subtitle')}
      </OdsText>
      <div
        role="radiogroup"
        aria-label={t('step.license_type.label')}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2"
      >
        {LICENSE_CARDS.map((card) => (
          <LicenseTypeCard
            key={card.family}
            card={card}
            selected={selected === card.family}
            onSelect={() => onSelect(card.family)}
          />
        ))}
      </div>
    </section>
  );
}
