import { policy as policyComponent } from '@iam/components';
import { asResolve, defaultBreadcrumbResolve } from '@iam/resolves';
import policiesRoute from './policies.route';

const resolves = [defaultBreadcrumbResolve];

export const name = 'policy';

export const state = ({ ROUTES }) => ({
  url: `/policy`,
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
