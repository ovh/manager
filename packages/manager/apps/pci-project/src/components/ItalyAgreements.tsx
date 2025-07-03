import { clsx } from 'clsx';
import {
  OdsAccordion,
  OdsCheckbox,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { ITALY_AGREEMENT_TEXT } from '@/constants';

export type TItalyAgreementsProps = {
  hasAgreements: boolean;
  onSetHasAgreements: (value: boolean) => void;
};

export default function ItalyAgreements({
  hasAgreements,
  onSetHasAgreements,
}: TItalyAgreementsProps) {
  return (
    <div className="italy-agreements text-left" data-testid="italy-agreements">
      <div className="flex items-center justify-start gap-4 mb-2">
        <OdsCheckbox
          name={'project-italy-agreements'}
          inputId={'project-italy-agreements'}
          isChecked={hasAgreements}
          onOdsChange={(e) => onSetHasAgreements(e.detail.checked)}
        />
        <label htmlFor="project-italy-agreements">
          <OdsText
            preset="paragraph"
            className={clsx(hasAgreements && 'font-bold')}
          >
            {ITALY_AGREEMENT_TEXT.TITLE}
          </OdsText>
        </label>
      </div>
      <OdsAccordion>
        <OdsText preset="span" className="font-bold" slot="summary">
          {ITALY_AGREEMENT_TEXT.LINK}
        </OdsText>
        <OdsText preset="paragraph">{ITALY_AGREEMENT_TEXT.DETAILS}</OdsText>
      </OdsAccordion>
    </div>
  );
}
