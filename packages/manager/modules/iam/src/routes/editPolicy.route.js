import {
  detailedPolicyParamResolve,
  editPolicyBreadcrumbResolve,
} from '../resolves';

const name = 'editPolicy';

const state = () => ({
  url: `/policy/{policy:uuid}/edit`,
  component: 'iamCreatePolicy',
  resolve: {
    breadcrumb: editPolicyBreadcrumbResolve,
    policy: detailedPolicyParamResolve,
  },
});

export default {
  name,
  state,
};
