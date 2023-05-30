import {
  asResolve,
  noBreadcrumbResolve,
  onboardingGuidesResolve,
  usersManagementLinkResolve,
} from '../resolves';

const name = 'policy';
const resolves = [
  noBreadcrumbResolve,
  onboardingGuidesResolve,
  usersManagementLinkResolve,
];

const state = () => ({
  url: '/policy',
  component: 'iamPolicy',
  redirectTo: 'iam.policy.policies',
  resolve: {
    ...asResolve(resolves),
  },
});

export default {
  name,
  state,
};
