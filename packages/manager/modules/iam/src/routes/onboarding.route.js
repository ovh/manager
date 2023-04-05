import { onboarding as onboardingComponent } from '@iam/components';
import {
  asResolve,
  noBreadcrumbResolve,
  hasPoliciesResolve,
} from '@iam/resolves';

const name = 'onboarding';
const resolves = [noBreadcrumbResolve];

const state = ({ ROUTES }) => ({
  url: '/onboarding',
  component: onboardingComponent.name,
  resolve: {
    ...asResolve(onboardingComponent.resolves),
    ...asResolve(resolves),
  },
  redirectTo: (transition) =>
    transition
      .injector()
      .getAsync(`${hasPoliciesResolve.key}`)
      .then((hasPolicies) =>
        hasPolicies ? { state: ROUTES.POLICIES } : false,
      ),
});

export default {
  name,
  state,
};
