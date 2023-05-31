import { cursorsParamResolve } from '../resolves';

const name = 'resourceGroups';

const state = () => ({
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

export default {
  name,
  state,
};
