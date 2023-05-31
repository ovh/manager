import {
  entityResolve,
  identityParamResolve,
  statementResolve,
} from '../resolves';

const name = 'deleteIdentity';

const state = () => ({
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

export default {
  name,
  state,
};
