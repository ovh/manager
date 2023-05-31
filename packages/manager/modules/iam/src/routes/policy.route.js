const name = 'policy';

const state = () => ({
  url: '/policy',
  component: 'iamPolicy',
  redirectTo: 'iam.policy.policies',
  resolve: {
    breadcrumb: () => null,
  },
});

export default {
  name,
  state,
};
