import { createResourceGroup } from '@iam/components';
import { asResolve, createResourceGroupBreadcrumbResolve } from '@iam/resolves';

const name = 'createResourceGroup';
const resolves = [createResourceGroupBreadcrumbResolve];

const state = () => ({
  url: '/resource_group/create',
  component: createResourceGroup.name,
  resolve: {
    ...asResolve(createResourceGroup.resolves),
    ...asResolve(resolves),
  },
});

export default {
  name,
  state,
};
