import {
  asPath,
  asResolve,
  policyParamResolve,
  policyIdentitiesBreadcrumbResolve,
  alertResolve,
  goBackResolve,
  goToResolve,
  onboardingGuidesResolve,
} from '../resolves';

const name = 'policyIdentities';
const resolves = [
  policyParamResolve,
  policyIdentitiesBreadcrumbResolve,
  alertResolve,
  goBackResolve,
  goToResolve,
  onboardingGuidesResolve,
];

const state = () => ({
  url: `/identity/${asPath(policyParamResolve)}`,
  component: 'iamPolicyIdentities',
  resolve: {
    ...asResolve(resolves),
  },
});

export default {
  name,
  state,
};
