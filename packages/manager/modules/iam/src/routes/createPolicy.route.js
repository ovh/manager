import {
  asResolve,
  createPolicyBreadcrumbResolve,
  alertResolve,
  goBackResolve,
  onboardingGuidesResolve,
  detailedPolicyParamResolve,
} from '../resolves';

const name = 'createPolicy';
const resolves = [
  createPolicyBreadcrumbResolve,
  alertResolve,
  goBackResolve,
  onboardingGuidesResolve,
  detailedPolicyParamResolve,
];

const state = () => ({
  url: '/policy/create',
  component: 'iamCreatePolicy',
  resolve: {
    ...asResolve(resolves),
  },
});

export default {
  name,
  state,
};
