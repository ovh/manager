import React from 'react';
import { OdsAccordion, OdsText } from '@ovhcloud/ods-components/react';

type FormAccordionProps = Readonly<
  Omit<React.ComponentProps<typeof OdsAccordion>, 'className'> & {
    label?: string;
    className?: string;
  }
>;

export const FormAccordion = ({
  label,
  className,
  ...props
}: FormAccordionProps) => (
  <OdsAccordion className={`form__accordion max-w-md ${className || ''}`}>
    <OdsText className="accordion__summary" slot="summary">
      {label}
    </OdsText>
    {props.children}
  </OdsAccordion>
);
