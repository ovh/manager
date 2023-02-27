import { policy as policyComponent } from '@iam/components';
import { asResolve, nullBreadcrumbResolve } from '@iam/resolves';
import policiesRoute from './policies.route';

const resolves = [nullBreadcrumbResolve];

export const name = 'policy';

export const state = ({ ROUTES }) => ({
  url: '/policy',
  component: policyComponent.name,
  redirectTo: ROUTES.POLICIES,
  resolve: {
    ...asResolve(policyComponent.resolves),
    ...asResolve(resolves),
  },
});

export const children = [policiesRoute];

export default {
  name,
  state,
  children,
};
