import { createPolicy as createPolicyComponent } from '@iam/components';
import {
  asPath,
  asResolve,
  editPolicyBreadcrumbResolve,
  detailedPolicyParamResolve,
} from '@iam/resolves';

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
