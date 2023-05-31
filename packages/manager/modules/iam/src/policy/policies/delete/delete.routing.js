import {
  entityResolve,
  policyParamResolve,
  statementResolve,
} from '../../../resolves';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.policy.policies.delete', {
    url: `/delete/{policy:uuid}`,
    component: 'iamDeleteEntity',
    resolve: {
      breadcrumb: () => null,
      entity: entityResolve,
      identity: () => null,
      policy: policyParamResolve,
      resourceGroup: () => null,
      statement: statementResolve,
    },
  });
};
