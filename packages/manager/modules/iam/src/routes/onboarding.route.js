import { onboarding as onboardingComponent } from '@iam/components';
import { asResolve, noBreadcrumbResolve } from '@iam/resolves';

const name = 'onboarding';
const resolves = [noBreadcrumbResolve];

const state = () => ({
  url: '/onboarding',
  component: onboardingComponent.name,
  resolve: {
    ...asResolve(onboardingComponent.resolves),
    ...asResolve(resolves),
  },
});

export default {
  name,
  state,
};
