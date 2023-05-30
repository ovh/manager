import {
  asPath,
  asResolve,
  noBreadcrumbResolve,
  policyParamResolve,
  alertResolve,
  entityResolve,
  goBackResolve,
  statementResolve,
} from '../resolves';

const name = 'deletePolicy';
const resolves = [
  noBreadcrumbResolve,
  policyParamResolve,
  alertResolve,
  entityResolve,
  goBackResolve,
  statementResolve,
];

const state = () => ({
  url: `/delete/${asPath(policyParamResolve)}`,
  component: 'iamDeleteEntity',
  resolve: {
    ...asResolve(resolves),
  },
});

export default {
  name,
  state,
};
