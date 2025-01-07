import React, { ReactNode } from 'react';
import { useFormSteps } from '@/hooks/formStep/useFormSteps';
import InstallationInitialStep from '../initialStep/InstallationInitialStep.page';
import InstallationStepDeployment from '../stepDeployment/InstallationStepDeployment.page';

const steps: Record<string, ReactNode> = {
  '1': <InstallationInitialStep />,
  '2': <InstallationStepDeployment />,
};

export default function FormStep() {
  const { currentStep } = useFormSteps();

  return steps[currentStep] || <div>Not developed yet.</div>;
}
