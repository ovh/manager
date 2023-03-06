import { policy as policyComponent } from '@iam/components';
import { asResolve, nullBreadcrumbResolve } from '@iam/resolves';
import policiesRoute from './policies.route';

const name = 'policy';
const children = [policiesRoute];
const resolves = [nullBreadcrumbResolve];

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
  children,
  state,
};
