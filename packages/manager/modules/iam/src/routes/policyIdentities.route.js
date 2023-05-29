import { policyIdentities as policyIdentitiesComponent } from '../components';
import {
  asPath,
  asResolve,
  policyParamResolve,
  policyIdentitiesBreadcrumbResolve,
} from '../resolves';

const name = 'policyIdentities';
const resolves = [policyParamResolve, policyIdentitiesBreadcrumbResolve];

const state = () => ({
  url: `/identity/${asPath(policyParamResolve)}`,
  component: policyIdentitiesComponent.name,
  resolve: {
    ...asResolve(policyIdentitiesComponent.resolves),
    ...asResolve(resolves),
  },
});

export default {
  name,
  state,
};
