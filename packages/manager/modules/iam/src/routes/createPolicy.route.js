import { createPolicyBreadcrumbResolve } from '../resolves';

const name = 'createPolicy';

const state = () => ({
  url: '/policy/create',
  component: 'iamCreatePolicy',
  resolve: {
    breadcrumb: createPolicyBreadcrumbResolve,
  },
});

export default {
  name,
  state,
};
