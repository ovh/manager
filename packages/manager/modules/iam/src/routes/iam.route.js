import { iam as iamComponent } from '@iam/components';
import { FEATURE, UNAVAILABLE_STATE_NAME } from '@iam/constants';
import {
  asResolve,
  featuresResolve,
  defaultBreadcrumbResolve,
} from '@iam/resolves';
import policyRoute from './policy.route';
import createPolicyRoute from './createPolicy.route';

const name = 'iam';
const children = [policyRoute, createPolicyRoute];
const resolves = [featuresResolve, defaultBreadcrumbResolve];

const state = ({ ROUTES }) => ({
  url: '/iam',
  component: iamComponent.name,
  redirectTo: (transition) =>
    transition
      .injector()
      .getAsync(featuresResolve.key)
      .then((featureAvailabilityResult) =>
        featureAvailabilityResult.isFeatureAvailable(FEATURE.MAIN)
          ? ROUTES.POLICY
          : { state: UNAVAILABLE_STATE_NAME },
      ),
  resolve: {
    ...asResolve(resolves),
  },
});

export default {
  name,
  children,
  state,
};
