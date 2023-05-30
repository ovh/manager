import { policies as policiesComponent } from '../components';
import {
  asParams,
  asQuery,
  asResolve,
  cursorsParamResolve,
  hasPoliciesResolve,
  noBreadcrumbResolve,
} from '../resolves';

const name = 'policies';
const params = [cursorsParamResolve];
const resolves = [noBreadcrumbResolve, hasPoliciesResolve];

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
  redirectTo: (transition) =>
    transition
      .injector()
      .getAsync(`${hasPoliciesResolve.key}`)
      .then((hasPolicies) =>
        !hasPolicies ? { state: 'iam.onboarding' } : false,
      ),
});

export default {
  name,
  state,
};
