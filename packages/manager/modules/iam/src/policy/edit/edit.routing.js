import {
  detailedPolicyParamResolve,
  editPolicyBreadcrumbResolve,
} from '../../resolves';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.editPolicy', {
    url: `/policy/edit/{policy:uuid}`,
    component: 'iamCreatePolicy',
    resolve: {
      breadcrumb: editPolicyBreadcrumbResolve,
      policy: detailedPolicyParamResolve,
    },
  });
};
