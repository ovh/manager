import React from 'react';

import {
  SELECTED_RADIO_BORDER_CLASS,
  SELECTED_RADIO_DOT_CLASS,
} from '@/utils/orderAccent/orderAccent';

interface RadioIndicatorProps {
  selected: boolean;
  className?: string;
}

/** Puce radio (anneau + point) réutilisée par les cartes sélectionnables du tunnel. */
export default function RadioIndicator({ selected, className = '' }: RadioIndicatorProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border-2 border-solid ${
        selected ? SELECTED_RADIO_BORDER_CLASS : 'border-[var(--ods-color-neutral-300)]'
      } ${className}`}
    >
      {selected && <span className={`h-[8px] w-[8px] rounded-full ${SELECTED_RADIO_DOT_CLASS}`} />}
    </span>
  );
}
