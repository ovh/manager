import {
  asParams,
  asQuery,
  asResolve,
  cursorsParamResolve,
  noBreadcrumbResolve,
  alertResolve,
  goToResolve,
} from '../resolves';

const name = 'resourceGroups';
const params = [cursorsParamResolve];
const resolves = [
  noBreadcrumbResolve,
  alertResolve,
  goToResolve,
  cursorsParamResolve,
];

const state = () => ({
  url: `/resource_groups?${asQuery(params)}`,
  component: 'iamResourceGroups',
  params: {
    ...asParams(params),
  },
  resolve: {
    ...asResolve(resolves),
  },
});

export default {
  name,
  state,
};
