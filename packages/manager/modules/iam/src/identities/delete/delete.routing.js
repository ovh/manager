import {
  entityResolve,
  identityParamResolve,
  statementResolve,
} from '../../resolves';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.identities.delete', {
    url: `/delete/{identity:urn}`,
    component: 'iamDeleteEntity',
    resolve: {
      breadcrumb: () => null,
      entity: entityResolve,
      identity: identityParamResolve,
      resourceGroup: () => null,
      statement: statementResolve,
    },
  });
};
