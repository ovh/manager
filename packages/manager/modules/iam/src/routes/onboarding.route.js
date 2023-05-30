import { onboarding as onboardingComponent } from '../components';
import {
  asResolve,
  noBreadcrumbResolve,
  hasPoliciesResolve,
} from '../resolves';

const name = 'onboarding';
const resolves = [noBreadcrumbResolve];

const state = () => ({
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
        hasPolicies ? { state: 'iam.policy.policies' } : false,
      ),
});

export default {
  name,
  state,
};
