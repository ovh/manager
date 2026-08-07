import React from 'react';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

export const fieldErrorId = (fieldId: string) => `${fieldId}-error`;

/**
 * Message d'erreur d'un champ, rendu dans le light DOM plutôt que via la prop `error` d'ODS : ODS 18
 * l'affiche dans son shadow root, où aucune région live ne l'annonce et où aucun `aria-describedby`
 * ne peut l'atteindre. Le conteneur est monté dès le premier rendu — une région live qui naît avec son
 * texte reste muette — et vide tant que le champ est valide.
 */
export const FieldError = ({ fieldId, message }: { fieldId: string; message?: string | null }) => (
  <div id={fieldErrorId(fieldId)} aria-live="polite" className="mt-1">
    {message && (
      <OdsText
        preset={ODS_TEXT_PRESET.caption}
        className="font-semibold [--ods-color-text:var(--ods-color-critical-500)]"
      >
        {message}
      </OdsText>
    )}
  </div>
);
