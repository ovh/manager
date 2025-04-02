import React from 'react';
import { OdsText, OdsSkeleton } from '@ovhcloud/ods-components/react';
import { StepFieldData } from '@/types/formStep.type';
import { testIds } from '@/utils/testIds.constants';
import { FORM_LABELS } from '@/constants/form.constants';

type FormFieldSummaryProps = React.HTMLAttributes<HTMLDivElement> & {
  field: StepFieldData;
  isLoading?: boolean;
};

export const FormFieldSummary = ({
  field,
  isLoading,
  ...props
}: FormFieldSummaryProps) => {
  const valueText = field.isSecretValue ? FORM_LABELS.secretText : field.value;

  return (
    <div
      className="flex items-start justify-between gap-x-4 max-w-md"
      {...props}
    >
      <OdsText className="max-w-60">{field.label}</OdsText>
      {isLoading && <OdsSkeleton className="w-20" />}
      {!isLoading && (
        <OdsText
          className="max-w-60 text-end"
          data-testid={testIds.summaryFieldValue}
        >
          {field.value ? valueText : FORM_LABELS.unknownText}
        </OdsText>
      )}
    </div>
  );
};
