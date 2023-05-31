import {
  policyIdentitiesBreadcrumbResolve,
  policyParamResolve,
} from '../resolves';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.identities', {
    url: `/identity/{policy:uuid}`,
    component: 'iamIdentities',
    resolve: {
      breadcrumb: policyIdentitiesBreadcrumbResolve,
      policy: policyParamResolve,
    },
  });
};
