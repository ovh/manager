import { deleteEntity as deleteEntityComponent } from '../components';
import {
  asPath,
  asResolve,
  noBreadcrumbResolve,
  policyParamResolve,
} from '../resolves';

const name = 'deletePolicy';
const resolves = [noBreadcrumbResolve, policyParamResolve];

const state = () => ({
  url: `/delete/${asPath(policyParamResolve)}`,
  component: deleteEntityComponent.name,
  resolve: {
    ...asResolve(deleteEntityComponent.resolves),
    ...asResolve(resolves),
  },
});

export default {
  name,
  state,
};
