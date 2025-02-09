import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { subRoutes, urls } from '@/routes/routes.constant';
import { StepId } from '@/types/formStep.type';

const createStepUrl = (stepNumber: number, serviceName?: string) =>
  stepNumber === 1 || !serviceName
    ? urls.installationInitialStep
    : urls.installationStep
        .replace(':stepId', stepNumber.toString())
        .replace(':serviceName', serviceName);

export const useFormSteps = () => {
  const { stepId, serviceName } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isInitialStep = pathname.includes(subRoutes.initialStep);
  const currentStep: StepId = isInitialStep ? '1' : (stepId as StepId);

  const initializeAndProceed = (selectedServiceName: string) => {
    if (isInitialStep && selectedServiceName)
      navigate(createStepUrl(2, selectedServiceName));
  };

  const nextStep = () => {
    if (stepId && serviceName)
      navigate(createStepUrl(Number(stepId) + 1, serviceName));
  };

  const previousStep = () => {
    if (!stepId || !serviceName || isInitialStep) return;
    if (stepId === '2') {
      navigate(urls.installationInitialStep);
    } else {
      navigate(createStepUrl(Number(stepId) - 1, serviceName));
    }
  };

  const goToStep = (step: StepId) =>
    navigate(createStepUrl(Number(step), serviceName));

  return {
    initializeAndProceed,
    nextStep,
    previousStep,
    goToStep,
    currentStep,
  };
};
