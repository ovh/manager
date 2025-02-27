import { TAG } from '../iam.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.api-keys', {
    url: '/api-keys?cursors',
    component: 'iamApiKeys',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('apiKeys')
        .then((applications) =>
          !applications ? { state: 'iam.api-keys.onboarding' } : false,
        ),
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('iam_api_keys'),
      apiKeys: /* @ngInject */ (IAMService) => IAMService.getApplications(),
    },
    atInternet: {
      rename: TAG.APPLICATIONS, // TODO : rename after tracking implementation
    },
  });
};
