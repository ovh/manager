
import {
  MAX_DISPLAY_COUNT,
  MINIMUM_TIME_INTERVAL_IN_MS,
  ONBOARDING_OPENED_STATE_ENUM,
} from './constants';
import {
  OnboardingPreferences,
  useCreateOnboardingPreferences,
  useOnboardingPreferences,
  useUpdateOnboardingPreferences
} from '@/hooks/useOnboardingPreferences';

export const useOnboarding = () => {

  const { data: onboardingPreferences, isFetched } = useOnboardingPreferences({});
  const createPreferences = useCreateOnboardingPreferences({});
  const updatePreferences = useUpdateOnboardingPreferences({});

  const currentTime = Date.now();
  const lastShowDate = onboardingPreferences?.lastShowDate || 0;
  const timeSinceLastShow = currentTime - lastShowDate;

  const showOnboarding = isFetched && onboardingPreferences?.showOnboarding && timeSinceLastShow >= MINIMUM_TIME_INTERVAL_IN_MS;
  const shouldShowOnboardingNextTime = onboardingPreferences?.numberOfDisplay < MAX_DISPLAY_COUNT;

  const updatePreference = (isDone: boolean) => {
    const data: OnboardingPreferences = {
      numberOfDisplay: onboardingPreferences?.numberOfDisplay + 1,
      lastShowDate: Date.now(),
      showOnboarding: !isDone && shouldShowOnboardingNextTime,
    }

    if (onboardingPreferences?.lastShowDate) {
      updatePreferences.mutate(data);
    } else {
      createPreferences.mutate(data);
    }
  }

  const hasStarted = (openedState: string) => {
    return openedState === ONBOARDING_OPENED_STATE_ENUM.WALKME;
  };
  
  return {
    updatePreference,
    hasStarted,
    showOnboarding,
    shouldShowOnboardingNextTime
  };
};

export default useOnboarding;
