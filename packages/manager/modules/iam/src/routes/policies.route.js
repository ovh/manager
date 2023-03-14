import { policies as policiesComponent } from '@iam/components';
import {
  asParams,
  asQuery,
  asResolve,
  cursorsParamResolve,
  noBreadcrumbResolve,
} from '@iam/resolves';

const name = 'policies';
const params = [cursorsParamResolve];
const resolves = [noBreadcrumbResolve];

const state = () => ({
  url: `?${asQuery(params)}`,
  component: policiesComponent.name,
  params: {
    ...asParams(params),
  },
  resolve: {
    ...asResolve(policiesComponent.resolves),
    ...asResolve(resolves),
  },
});

export default {
  name,
  state,
};
