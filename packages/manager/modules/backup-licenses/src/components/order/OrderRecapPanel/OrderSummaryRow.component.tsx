import React from 'react';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

interface OrderSummaryRowProps {
  label: string;
  /** Valeur déjà résolue/traduite, ou vide/null si le champ n'est pas encore renseigné. */
  value?: string | null;
  /** Placeholder affiché à la place de la valeur quand celle-ci est vide (état « à renseigner »). */
  emptyLabel: string;
}

/**
 * Ligne label / valeur du récapitulatif. Une valeur vide bascule en placeholder
 * discret (italique, gris clair) : l'utilisateur voit d'un coup d'œil ce qu'il reste à saisir.
 */
export default function OrderSummaryRow({ label, value, emptyLabel }: OrderSummaryRowProps) {
  const isEmpty = value == null || value.trim() === '';

  return (
    <div className="flex items-baseline justify-between gap-3">
      <OdsText
        preset={ODS_TEXT_PRESET.paragraph}
        className="shrink-0 [--ods-color-text:var(--ods-color-neutral-500)]"
      >
        {label}
      </OdsText>
      <OdsText
        preset={ODS_TEXT_PRESET.paragraph}
        className={`min-w-0 truncate text-right ${
          isEmpty
            ? 'italic [--ods-color-text:var(--ods-color-neutral-400)]'
            : 'font-medium [--ods-color-text:var(--ods-color-neutral-700)]'
        }`}
      >
        {isEmpty ? emptyLabel : value}
      </OdsText>
    </div>
  );
}
