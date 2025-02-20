export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.api-keys', {
    url: '/api-keys',
    component: 'iamApiKeys',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('iam_api_keys'),
    },
  });
};
