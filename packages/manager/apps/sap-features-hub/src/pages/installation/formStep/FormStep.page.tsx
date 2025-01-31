import React from 'react';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useFormSteps } from '@/hooks/formStep/useFormSteps';
import { INSTALLATION_STEPS } from '../installation.constants';

export default function FormStep() {
  const { currentStep, previousStep } = useFormSteps();
  const { t } = useTranslation('installation');

  return (
    INSTALLATION_STEPS[currentStep] || (
      <div>
        <p>Not developed yet.</p>
        <OdsButton
          label={t('previous_step_cta')}
          variant="outline"
          onClick={previousStep}
        />
      </div>
    )
  );
}
