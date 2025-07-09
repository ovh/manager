import NavigationStep from './step.navigation';

export const NAVIGATION = {
  FIRST_STEP: new NavigationStep({ index: 0 }),
  PREVIOUS_STEP: new NavigationStep({ relativeIndex: -1 }),
  CURRENT_STEP: new NavigationStep({ relativeIndex: 0 }),
  NEXT_STEP: new NavigationStep({ relativeIndex: 1 }),
  LAST_STEP: new NavigationStep({ index: -1 }),
};

export default {
  NAVIGATION,
};
