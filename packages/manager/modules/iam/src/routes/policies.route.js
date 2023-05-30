import {
  asParams,
  asQuery,
  asResolve,
  cursorsParamResolve,
  hasPoliciesResolve,
  noBreadcrumbResolve,
  alertResolve,
  goToResolve,
  advancedModeResolve,
} from '../resolves';

const name = 'policies';
const params = [cursorsParamResolve];
const resolves = [
  noBreadcrumbResolve,
  hasPoliciesResolve,
  alertResolve,
  goToResolve,
  advancedModeResolve,
  cursorsParamResolve,
];

const state = () => ({
  url: `?${asQuery(params)}`,
  component: 'iamPolicies',
  params: {
    ...asParams(params),
  },
  resolve: {
    ...asResolve(resolves),
  },
  redirectTo: (transition) =>
    transition
      .injector()
      .getAsync(`${hasPoliciesResolve.key}`)
      .then((hasPolicies) =>
        !hasPolicies ? { state: 'iam.onboarding' } : false,
      ),
});

export default {
  name,
  state,
};
