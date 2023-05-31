import {
  entityResolve,
  resourceGroupParamResolve,
  statementResolve,
} from '../../../resolves';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.policy.resourceGroups.delete', {
    url: `/delete/{resourceGroup:uuid}`,
    component: 'iamDeleteEntity',
    resolve: {
      breadcrumb: () => null,
      entity: entityResolve,
      identity: () => null,
      policy: () => null,
      resourceGroup: resourceGroupParamResolve,
      statement: statementResolve,
    },
  });
};
