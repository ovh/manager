import { API_KEYS_TRACKING_HITS } from '../api-keys.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.api-keys.onboarding', {
    url: '/onboarding',
    component: 'iamApiKeysOnboarding',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('apiKeys')
        .then((apiKeys) =>
          apiKeys.length > 0 ? { state: 'iam.api-keys' } : false,
        ),
    resolve: {
      breadcrumb: () => null,
    },
    atInternet: {
      rename: API_KEYS_TRACKING_HITS.ONBOARDING_PAGE,
    },
  });
};
