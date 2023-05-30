import { iam as iamComponent } from '../components';
import { FEATURE, UNAVAILABLE_STATE_NAME } from '../iam.constants';
import {
  asResolve,
  featuresResolve,
  defaultBreadcrumbResolve,
} from '../resolves';

const name = 'iam';
const resolves = [featuresResolve, defaultBreadcrumbResolve];

const state = () => ({
  url: '/iam',
  component: iamComponent.name,
  redirectTo: (transition) =>
    transition
      .injector()
      .getAsync(featuresResolve.key)
      .then((featureAvailabilityResult) =>
        featureAvailabilityResult.isFeatureAvailable(FEATURE.MAIN)
          ? 'iam.policy'
          : { state: UNAVAILABLE_STATE_NAME },
      ),
  resolve: {
    ...asResolve(resolves),
  },
});

export default {
  name,
  state,
};
