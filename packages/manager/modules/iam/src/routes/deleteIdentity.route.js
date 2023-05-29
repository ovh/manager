import { deleteEntity as deleteEntityComponent } from '../components';
import {
  asPath,
  asResolve,
  noBreadcrumbResolve,
  identityParamResolve,
} from '../resolves';

const name = 'deleteIdentity';
const resolves = [noBreadcrumbResolve, identityParamResolve];

const state = () => ({
  url: `/delete/${asPath(identityParamResolve)}`,
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
