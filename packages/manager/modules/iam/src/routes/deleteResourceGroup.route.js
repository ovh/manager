import {
  entityResolve,
  resourceGroupParamResolve,
  statementResolve,
} from '../resolves';

const name = 'deleteResourceGroup';

const state = () => ({
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

export default {
  name,
  state,
};
