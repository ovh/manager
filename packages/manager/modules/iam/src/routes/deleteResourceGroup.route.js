import {
  asPath,
  asResolve,
  noBreadcrumbResolve,
  resourceGroupParamResolve,
  alertResolve,
  entityResolve,
  goBackResolve,
  statementResolve,
} from '../resolves';

const name = 'deleteResourceGroup';
const resolves = [
  noBreadcrumbResolve,
  resourceGroupParamResolve,
  alertResolve,
  entityResolve,
  goBackResolve,
  statementResolve,
];

const state = () => ({
  url: `/delete/${asPath(resourceGroupParamResolve)}`,
  component: 'iamDeleteEntity',
  resolve: {
    ...asResolve(resolves),
  },
});

export default {
  name,
  state,
};
