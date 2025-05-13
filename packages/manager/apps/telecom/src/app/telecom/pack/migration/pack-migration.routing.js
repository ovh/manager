export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.migration', {
    url: '/migration',
    views: {
      '@telecom.packs': 'packMigration',
    },
    resolve: {
      goBack: /* @ngInject */ ($state) => () => $state.go('telecom.packs.pack'),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('telecom_pack_migration_title'),
    },
  });
};
