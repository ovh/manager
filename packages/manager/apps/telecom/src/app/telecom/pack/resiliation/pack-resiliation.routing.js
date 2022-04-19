export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.resiliation', {
    url: '/resiliation',
    views: {
      '@telecom.packs': 'packResiliation',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pack_resiliation_title'),
    },
  });
};
