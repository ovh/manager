import { iam as iamComponent } from '@iam/components';
import { FEATURE, UNAVAILABLE_STATE_NAME } from '@iam/constants';
import {
  asResolve,
  featuresResolve,
  defaultBreadcrumbResolve,
} from '@iam/resolves';
import policyRoute from './policy.route';
import createPolicyRoute from './createPolicy.route';

const resolves = [featuresResolve, defaultBreadcrumbResolve];
const unavailableState = {
  state: UNAVAILABLE_STATE_NAME,
};

export const name = 'iam';

export const state = ({ ROUTES }) => ({
  url: '/iam',
  component: iamComponent.name,
  redirectTo: (transition) =>
    transition
      .injector()
      .getAsync(featuresResolve.key)
      .then((featureAvailabilityResult) =>
        featureAvailabilityResult.isFeatureAvailable(FEATURE.MAIN)
          ? ROUTES.POLICY
          : unavailableState,
      ),
  resolve: asResolve(resolves),
});

export const children = [policyRoute, createPolicyRoute];

export default {
  name,
  state,
  children,
};
