import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { StepSummary } from '@/types/formStep.type';
import { useFormSteps } from '@/hooks/formStep/useFormSteps';
import { FormFieldSummary } from './FormFieldSummary.component';
import { testIds } from '@/utils/testIds.constants';

type FormStepSummaryProps = React.HTMLAttributes<HTMLDivElement> & {
  step: StepSummary;
};

export const FormStepSummary = ({ step, ...props }: FormStepSummaryProps) => {
  const { t } = useTranslation(['installation', NAMESPACES.ACTIONS]);
  const { goToStep } = useFormSteps();

  return (
    <div className="flex flex-col gap-y-6" {...props}>
      <OdsText preset="heading-3">{step.title}</OdsText>
      <div className="flex flex-col gap-y-1">
        {step.fields.map((field, i) => (
          <React.Fragment key={`field_${field.label}_${i}`}>
            {field.type === 'subtitle' ? (
              <OdsText
                preset={field.isMinor ? 'paragraph' : 'heading-4'}
                class={`my-2 ${field.isMinor ? 'summary__minor-subtitle' : ''}`}
              >
                {field.label}
              </OdsText>
            ) : (
              <FormFieldSummary field={field} />
            )}
          </React.Fragment>
        ))}
      </div>
      <OdsButton
        label={t(`${NAMESPACES.ACTIONS}:modify`)}
        variant="ghost"
        onClick={() => goToStep(step.id)}
        className="w-fit"
        data-testid={testIds.summaryUpdateCta}
      />
    </div>
  );
};
