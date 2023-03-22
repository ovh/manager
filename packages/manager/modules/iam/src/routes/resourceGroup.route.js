import { resourceGroup as resourceGroupComponent } from '@iam/components';
import {
  asParams,
  asQuery,
  asResolve,
  cursorsParamResolve,
  noBreadcrumbResolve,
} from '@iam/resolves';

const name = 'resourceGroup';
const params = [cursorsParamResolve];
const resolves = [noBreadcrumbResolve];

const state = () => ({
  url: `/resource_group/?${asQuery(params)}`,
  component: resourceGroupComponent.name,
  params: {
    ...asParams(params),
  },
  resolve: {
    ...asResolve(resourceGroupComponent.resolves),
    ...asResolve(resolves),
  },
});

export default {
  name,
  state,
};
