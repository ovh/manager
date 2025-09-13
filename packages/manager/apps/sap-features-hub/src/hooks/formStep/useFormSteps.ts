import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { subRoutes, urls } from '@/routes/routes.constant';
import { StepId } from '@/types/formStep.type';
import { buildSearchQuery } from '@/utils/buildSearchQuery';
import { useSapSearchParams } from '../sapSearchParams/useSapSearchParams';

const createStepUrl = (stepNumber: number, serviceName?: string) => {
  if (serviceName && stepNumber !== 1) {
    const url = urls.installationStep.replace(':stepId', stepNumber.toString());
    const query = buildSearchQuery({ serviceName });
    return `${url}${query}`;
  }
  return urls.installationInitialStep;
};

export const useFormSteps = () => {
  const { stepId } = useParams();
  const { serviceName } = useSapSearchParams();
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
    if (!stepId || isInitialStep) return;
    if (stepId === '2' || !serviceName) {
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
    serviceName,
  };
};
