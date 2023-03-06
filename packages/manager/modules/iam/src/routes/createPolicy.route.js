import { createPolicy } from '@iam/components';
import { asResolve, createPolicyBreadcrumb } from '@iam/resolves';

const name = 'createPolicy';
const resolves = [createPolicyBreadcrumb];

const state = () => ({
  url: '/policy/create',
  component: createPolicy.name,
  resolve: {
    ...asResolve(createPolicy.resolves),
    ...asResolve(resolves),
  },
});

export default {
  name,
  state,
};
