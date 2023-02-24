import { policies as policiesComponent } from '@iam/components';
import {
  asParams,
  asQuery,
  asResolve,
  cursorsParamResolve,
  nullBreadcrumbResolve,
} from '@iam/resolves';

const params = [cursorsParamResolve];
const resolves = [nullBreadcrumbResolve];

export const name = 'policies';

export const state = () => ({
  url: `?${asQuery(params)}`,
  component: policiesComponent.name,
  params: asParams(params),
  resolve: {
    ...asResolve(policiesComponent.resolves),
    ...asResolve(resolves),
  },
});

export default {
  name,
  state,
};
