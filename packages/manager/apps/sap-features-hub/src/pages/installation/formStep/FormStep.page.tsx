import React, { ReactNode } from 'react';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useFormSteps } from '@/hooks/formStep/useFormSteps';
import InstallationInitialStep from '../initialStep/InstallationInitialStep.page';
import InstallationStepDeployment from '../stepDeployment/InstallationStepDeployment.page';
import InstallationStepSystemInformation from '../stepSystemInformation/InstallationStepSystemInformation.page';

const steps: Record<string, ReactNode> = {
  '1': <InstallationInitialStep />,
  '2': <InstallationStepDeployment />,
  '3': <InstallationStepSystemInformation />,
} as const;

export default function FormStep() {
  const { currentStep } = useFormSteps();
  const { t } = useTranslation('installation');
  const { previousStep } = useFormSteps();

  return (
    steps[currentStep] || (
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
