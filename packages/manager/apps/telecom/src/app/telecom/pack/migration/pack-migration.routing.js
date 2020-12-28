export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.migration', {
    url: '/migration',
    views: {
      '@telecom.packs': 'packMigration',
    },
    resolve: {
      goBack: /* @ngInject */ ($state) => () => $state.go('telecom.packs.pack'),
    },
  });
};
