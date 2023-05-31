import {
  policyIdentitiesBreadcrumbResolve,
  policyParamResolve,
} from '../resolves';

const name = 'policyIdentities';

const state = () => ({
  url: `/identity/{policy:uuid}`,
  component: 'iamPolicyIdentities',
  resolve: {
    breadcrumb: policyIdentitiesBreadcrumbResolve,
    policy: policyParamResolve,
  },
});

export default {
  name,
  state,
};
