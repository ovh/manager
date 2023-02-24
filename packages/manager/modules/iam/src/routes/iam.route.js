import { iam as iamComponent } from '@iam/components';
import { FEATURE, UNAVAILABLE_STATE_NAME } from '@iam/constants';
import {
  asResolve,
  featuresResolve,
  nullBreadcrumbResolve,
} from '@iam/resolves';
import policyRoute from './policy.route';

const resolves = [featuresResolve, nullBreadcrumbResolve];
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

export const children = [policyRoute];

export default {
  name,
  state,
  children,
};
