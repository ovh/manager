import React from 'react';

import { ODS_BUTTON_VARIANT, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';

interface OrderFooterProps {
  leftLabel: string;
  onLeft: () => void;
  primaryLabel: string;
  primaryDisabled: boolean;
  isSubmitting?: boolean;
  onPrimary: () => void;
  /**
   * Épingle le footer en bas du viewport (sticky) sur la dernière étape, longue :
   * le CTA « Commander » reste atteignable sans scroller jusqu'en bas. Rendu en carte
   * flottante détachée du bord (bordure + fond opaque, sans ombre) plutôt qu'en barre
   * collée au bas de l'écran.
   */
  isSticky?: boolean;
  /**
   * Prix affiché juste à gauche du bouton primaire (dernière étape). Le montant
   * accompagne ainsi l'engagement : il reste sous les yeux au moment de commander,
   * même quand le récapitulatif a été scrollé hors de l'écran.
   */
  priceLabel?: string;
  priceValue?: string;
}

/** Footer du wizard : bouton gauche (Annuler/Retour) + prix optionnel + bouton primaire. */
export default function OrderFooter({
  leftLabel,
  onLeft,
  primaryLabel,
  primaryDisabled,
  isSubmitting = false,
  onPrimary,
  isSticky = false,
  priceLabel,
  priceValue,
}: OrderFooterProps) {
  return (
    <div
      className={`mt-10 flex items-center justify-between gap-4 ${
        isSticky
          ? 'sticky bottom-4 z-10 rounded-xl border border-[var(--ods-color-neutral-200)] bg-[var(--ods-color-neutral-000)] px-6 py-4'
          : 'border-t border-[var(--ods-color-neutral-200)] pt-8'
      }`}
    >
      <OdsButton
        type="button"
        variant={ODS_BUTTON_VARIANT.ghost}
        label={leftLabel}
        onClick={onLeft}
      />
      <div className="flex items-center gap-6">
        {priceValue && (
          <span className="flex flex-col items-end">
            <OdsText
              preset={ODS_TEXT_PRESET.caption}
              className="text-[var(--ods-color-neutral-500)]"
            >
              {priceLabel}
            </OdsText>
            <OdsText preset={ODS_TEXT_PRESET.paragraph} className="font-semibold">
              {priceValue}
            </OdsText>
          </span>
        )}
        <OdsButton
          type="button"
          label={primaryLabel}
          isDisabled={primaryDisabled}
          isLoading={isSubmitting}
          onClick={onPrimary}
        />
      </div>
    </div>
  );
}
