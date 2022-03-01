import { useContext } from 'react';
import OnboardingContext from './context';

const useOnboarding = () => {
  return useContext(OnboardingContext);
};

export default useOnboarding;
