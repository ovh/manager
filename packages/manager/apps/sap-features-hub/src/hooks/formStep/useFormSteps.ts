import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { subRoutes, urls } from '@/routes/routes.constant';

const createStepUrl = (stepNumber: number, serviceName: string) =>
  urls.installationStep
    .replace(':stepId', stepNumber.toString())
    .replace(':serviceName', serviceName);

export const useFormSteps = () => {
  const { stepId, serviceName } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isInitialStep = pathname.includes(subRoutes.initialStep);

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

  return {
    initializeAndProceed,
    nextStep,
    previousStep,
    currentStep: isInitialStep ? '1' : stepId,
  };
};
