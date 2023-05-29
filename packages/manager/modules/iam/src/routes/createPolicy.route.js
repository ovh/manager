import { createPolicy } from '../components';
import { asResolve, createPolicyBreadcrumbResolve } from '../resolves';

const name = 'createPolicy';
const resolves = [createPolicyBreadcrumbResolve];

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
