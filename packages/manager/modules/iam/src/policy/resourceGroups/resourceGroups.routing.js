import { cursorsParamResolve } from '../../resolves';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.policy.resourceGroups', {
    url: `/resourceGroups?cursors`,
    component: 'iamResourceGroups',
    params: {
      cursors: cursorsParamResolve.declaration,
    },
    resolve: {
      breadcrumb: () => null,
      cursors: cursorsParamResolve,
    },
  });
};
