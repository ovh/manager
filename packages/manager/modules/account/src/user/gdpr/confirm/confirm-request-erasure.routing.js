export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('account.user.gdpr.confirm', {
    url: '/:publicId/confirm-request-erasure',
    component: 'gdprFeaturesConfirm',
    resolve: {
      publicId: /* @ngInject */ ($transition$) =>
        $transition$.params().publicId,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('gdpr_erasure_confirm_title'),
    },
  });
};
