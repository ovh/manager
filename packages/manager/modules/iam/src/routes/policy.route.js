import { policy as policyComponent } from '@iam/components';
import { asResolve, noBreadcrumbResolve } from '@iam/resolves';

const name = 'policy';
const resolves = [noBreadcrumbResolve];

const state = ({ ROUTES }) => ({
  url: '/policy',
  component: policyComponent.name,
  redirectTo: ROUTES.POLICIES,
  resolve: {
    ...asResolve(policyComponent.resolves),
    ...asResolve(resolves),
  },
});

export default {
  name,
  state,
};
