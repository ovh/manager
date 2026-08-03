import React from 'react';

import { ODS_ICON_NAME, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsIcon, OdsText } from '@ovhcloud/ods-components/react';

export type ActionButtonProps = {
  id?: string;
  testId: string;
  icon: ODS_ICON_NAME;
  accessibleName: string;
  visibleLabel?: string;
  className?: string;
  onClick: () => void;
  disclosedOverlayId?: string;
  isExpanded?: boolean;
  popupRole?: 'menu' | 'dialog';
};

const ACTION_BUTTON_CLASS = [
  // Tailwind's preflight is off in the consuming apps and nothing else resets `button`, so the
  // user-agent background, border and 13.3px font survive unless they are cleared here.
  'cursor-pointer appearance-none border-0 bg-transparent [font:inherit]',
  // Explicit rem, because manager-tailwind-config remaps the spacing scale onto the ODS tokens
  // (`gap-1` is 0.0625rem, `p-2` 0.125rem) — far too small for a hit area.
  'inline-flex shrink-0 items-center justify-center gap-[0.25rem] rounded',
  'min-h-[1.5rem] min-w-[1.5rem]',
  'text-[var(--ods-color-primary-500)] hover:bg-[var(--ods-color-primary-050)]',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
  'focus-visible:outline-[var(--ods-color-primary-500)]',
].join(' ');

const ICON_ONLY_PADDING_CLASS = 'p-[0.25rem]';
const LABELLED_PADDING_CLASS = 'px-[0.5rem] py-[0.25rem]';

/**
 * ODS 18's `ods-button` renders its real `<button>` inside a shadow root and names it from the
 * `label` prop alone: an `aria-label` set on the host never becomes the control's accessible name.
 * An icon-driven action therefore has to be a native button here, dressed with the ODS icon and
 * the ODS colour tokens.
 *
 * `accessibleName` names the control only while it is icon-only. Once a `visibleLabel` is rendered the
 * name is that same string — WCAG 2.1 SC 2.5.3 (Label in Name): the two texts come from two translation
 * keys and diverge per locale (it_IT displays "Mostrare", named "Mostra la chiave segreta"), and a name
 * that overrides the visible text leaves a speech-input user unable to activate what they read. The
 * `aria-label` is kept, bound to the variable the label renders: the two cannot desynchronise, and the
 * name does not depend on `ods-text` exposing its slotted text. The extra context becomes the
 * accessible *description*, announced after the name.
 */
export const ActionButton = ({
  id,
  testId,
  icon,
  accessibleName,
  visibleLabel,
  className = '',
  onClick,
  disclosedOverlayId,
  isExpanded,
  popupRole,
}: ActionButtonProps) => {
  const isLabelled = !!visibleLabel;
  const descriptionId = isLabelled ? `${testId}-description` : undefined;
  const paddingClass = isLabelled ? LABELLED_PADDING_CLASS : ICON_ONLY_PADDING_CLASS;

  return (
    <button
      id={id}
      type="button"
      data-testid={testId}
      aria-label={isLabelled ? visibleLabel : accessibleName}
      aria-describedby={descriptionId}
      aria-haspopup={popupRole}
      aria-expanded={popupRole ? !!isExpanded : undefined}
      aria-controls={disclosedOverlayId}
      className={`${ACTION_BUTTON_CLASS} ${paddingClass} ${className}`.trim()}
      onClick={onClick}
    >
      <OdsIcon name={icon} aria-hidden="true" />
      {isLabelled && (
        <>
          <OdsText preset={ODS_TEXT_PRESET.span}>{visibleLabel}</OdsText>
          <span id={descriptionId} className="sr-only">
            {accessibleName}
          </span>
        </>
      )}
    </button>
  );
};
