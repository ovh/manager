import { createPolicyBreadcrumbResolve } from '../../resolves';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.createPolicy', {
    url: '/policy/create',
    component: 'iamCreatePolicy',
    resolve: {
      breadcrumb: createPolicyBreadcrumbResolve,
    },
  });
};
