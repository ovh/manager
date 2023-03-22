import { resourceGroups as resourceGroupsComponent } from '@iam/components';
import {
  asParams,
  asQuery,
  asResolve,
  cursorsParamResolve,
  noBreadcrumbResolve,
} from '@iam/resolves';

const name = 'resourceGroups';
const params = [cursorsParamResolve];
const resolves = [noBreadcrumbResolve];

const state = () => ({
  url: `/resource_groups?${asQuery(params)}`,
  component: resourceGroupsComponent.name,
  params: {
    ...asParams(params),
  },
  resolve: {
    ...asResolve(resourceGroupsComponent.resolves),
    ...asResolve(resolves),
  },
});

export default {
  name,
  state,
};
