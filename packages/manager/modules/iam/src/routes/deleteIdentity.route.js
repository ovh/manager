import {
  asPath,
  asResolve,
  noBreadcrumbResolve,
  identityParamResolve,
  alertResolve,
  entityResolve,
  goBackResolve,
  statementResolve,
} from '../resolves';

const name = 'deleteIdentity';
const resolves = [
  noBreadcrumbResolve,
  identityParamResolve,
  alertResolve,
  entityResolve,
  goBackResolve,
  statementResolve,
];

const state = () => ({
  url: `/delete/${asPath(identityParamResolve)}`,
  component: 'iamDeleteEntity',
  resolve: {
    ...asResolve(resolves),
  },
});

export default {
  name,
  state,
};
