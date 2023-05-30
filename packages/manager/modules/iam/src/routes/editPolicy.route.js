import {
  asPath,
  asResolve,
  editPolicyBreadcrumbResolve,
  detailedPolicyParamResolve,
  alertResolve,
  goBackResolve,
  onboardingGuidesResolve,
} from '../resolves';

const name = 'editPolicy';
const resolves = [
  editPolicyBreadcrumbResolve,
  detailedPolicyParamResolve,
  alertResolve,
  goBackResolve,
  onboardingGuidesResolve,
];

const state = () => ({
  url: `/policy/${asPath(detailedPolicyParamResolve)}/edit`,
  component: 'iamCreatePolicy',
  resolve: {
    ...asResolve(resolves),
  },
});

export default {
  name,
  state,
};
