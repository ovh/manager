import {
  entityResolve,
  policyParamResolve,
  statementResolve,
} from '../resolves';

const name = 'deletePolicy';

const state = () => ({
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

export default {
  name,
  state,
};
