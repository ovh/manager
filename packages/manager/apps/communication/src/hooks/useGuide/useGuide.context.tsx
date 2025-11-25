import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GuideStep } from "./useGuide.type";

export type GuideContext = {
  steps: GuideStep[];
  goNext: () => void;
  goPrevious: () => void;
  goToStep: (step: number) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isActive: boolean;
  start: () => void;
  stop: () => void;
};

export const GuideContext = createContext<GuideContext | null>(null);

export const useGuideContext = (): GuideContext => {
  const context = useContext(GuideContext);
  if (!context) {
    throw new Error('useGuideContext must be used within a GuideProvider');
  }
  return context;
};

type GuideProviderProps = {
  children: React.ReactNode;
  steps: GuideStep[];
  postGuideRoute?: string;
  autoStart?: boolean;
};

export const GuideProvider = ({ children, steps, postGuideRoute, autoStart = false }: GuideProviderProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(autoStart);
  const navigate = useNavigate();
  const location = useLocation();

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const stop = useCallback(() => {
    setIsActive(false);
    if (postGuideRoute) {
      navigate(postGuideRoute);
    }
  }, []);

  const navigateToStep = useCallback(async (stepIndex: number) => {
    const step = steps[stepIndex];
    if (!step) return;

    if (step.route !== location.pathname) {
      navigate(step.route);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    if (step.onBeforeEnter) {
      await step.onBeforeEnter();
    }
  }, [steps, navigate, location.pathname]);

  const goNext = useCallback(async () => {
    if (isLastStep) {
      stop();
      return;
    }
    const nextStep = currentStep + 1;
    await navigateToStep(nextStep);
    setCurrentStep(nextStep);
  }, [currentStep, isLastStep, navigateToStep, stop]);

  const goPrevious = useCallback(async () => {
    if (isFirstStep) return;
    const prevStep = currentStep - 1;
    await navigateToStep(prevStep);
    setCurrentStep(prevStep);
  }, [currentStep, isFirstStep, navigateToStep]);

  const goToStep = useCallback(async (step: number) => {
    if (step < 0 || step >= steps.length) return;
    await navigateToStep(step);
    setCurrentStep(step);
  }, [steps.length, navigateToStep]);

  const start = useCallback(async () => {
    setIsActive(true);
    await navigateToStep(0);
    setCurrentStep(0);
  }, [navigateToStep]);

  return (
    <GuideContext.Provider value={{
      steps,
      goNext,
      goPrevious,
      goToStep,
      isFirstStep,
      isLastStep,
      currentStep,
      setCurrentStep,
      isActive,
      start,
      stop,
    }}>
      {children}
    </GuideContext.Provider>
  );
};
