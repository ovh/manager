export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('account.user.gdpr', {
    url: '/personal-data',
    component: 'gdprFeatures',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('user_account_gdpr_features_title'),
    },
  });
};
