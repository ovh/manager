import { TAG } from '../iam.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.api-keys', {
    url: '/api-keys',
    component: 'iamApiKeys',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('apiKeys')
        .then(
          (apiKeys) =>
            apiKeys.length === 0 && { state: 'iam.api-keys.onboarding' },
        ),
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('iam_api_keys'),
      apiKeys: /* @ngInject */ (IAMService) => IAMService.getApiKeys(),
    },
    atInternet: {
      rename: TAG.API_KEYS,
    },
  });
};
