import { useState } from 'react';

export enum Step {
  Config = 0,
  Payment = 1,
  CreditConfirmation = 2,
}

const getStepStates = (currentStep: Step) => ({
  // Config step (Step 0)
  isConfigChecked: currentStep > Step.Config,
  isConfigLocked: currentStep > Step.Config,

  // Payment step (Step 1)
  isPaymentOpen: currentStep > Step.Config,
  isPaymentChecked: currentStep > Step.Payment,
  isPaymentLocked: currentStep !== Step.Payment,

  // Credit confirmation step (Step 2)
  isCreditConfirmationOpen: currentStep === Step.CreditConfirmation,
  isCreditConfirmationChecked: false,
  isCreditConfirmationLocked: false,
});

export const useStepper = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.Config);

  const stepStates = getStepStates(currentStep);

  const goToConfig = () => setCurrentStep(Step.Config);
  const goToPayment = () => setCurrentStep(Step.Payment);
  const goToCreditConfirmation = () => setCurrentStep(Step.CreditConfirmation);

  return {
    ...stepStates,
    goToConfig,
    goToPayment,
    goToCreditConfirmation,
  };
};
