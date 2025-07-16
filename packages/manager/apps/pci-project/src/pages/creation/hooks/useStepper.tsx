import { useState } from 'react';

/**
 * Custom hook to manage stepper state for the project creation flow.
 * Returns the current step, a setter, and booleans for each step's state.
 */
export const useStepper = () => {
  const [currentStep, setCurrentStep] = useState(0);

  // Step 1: Config
  const isConfigChecked = currentStep > 0;
  const isConfigLocked = currentStep > 0;

  // Step 2: Payment
  const isPaymentOpen = currentStep === 1;
  const isPaymentChecked = false; // (update if you add more steps)
  const isPaymentLocked = currentStep < 1;

  return {
    currentStep,
    setCurrentStep,
    isConfigChecked,
    isConfigLocked,
    isPaymentOpen,
    isPaymentChecked,
    isPaymentLocked,
  };
};
