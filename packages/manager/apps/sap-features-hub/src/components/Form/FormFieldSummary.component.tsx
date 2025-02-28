import React from 'react';
import { OdsText } from '@ovhcloud/ods-components/react';
import { StepFieldData } from '@/types/formStep.type';
import { testIds } from '@/utils/testIds.constants';
import { FORM_LABELS } from '@/constants/form.constants';

type FormFieldSummaryProps = React.HTMLAttributes<HTMLDivElement> & {
  field: StepFieldData;
};

export const FormFieldSummary = ({
  field,
  ...props
}: FormFieldSummaryProps) => {
  const valueText = field.isSecretValue ? FORM_LABELS.secretText : field.value;

  return (
    <div
      className="flex items-start justify-between gap-x-4 max-w-sm"
      {...props}
    >
      <OdsText className="max-w-60">{field.label}</OdsText>
      <OdsText className="max-w-60" data-testid={testIds.summaryFieldValue}>
        {field.value ? valueText : FORM_LABELS.unknownText}
      </OdsText>
    </div>
  );
};
