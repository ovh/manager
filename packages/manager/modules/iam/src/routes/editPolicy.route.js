import { createPolicy as createPolicyComponent } from '../components';
import {
  asPath,
  asResolve,
  editPolicyBreadcrumbResolve,
  detailedPolicyParamResolve,
} from '../resolves';

const name = 'editPolicy';
const resolves = [editPolicyBreadcrumbResolve, detailedPolicyParamResolve];

const state = () => ({
  url: `/policy/${asPath(detailedPolicyParamResolve)}/edit`,
  component: createPolicyComponent.name,
  resolve: {
    ...asResolve(createPolicyComponent.resolves),
    ...asResolve(resolves),
  },
});

export default {
  name,
  state,
};
