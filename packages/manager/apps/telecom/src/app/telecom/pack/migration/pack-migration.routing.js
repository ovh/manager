export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.migration', {
    url: '/migration',
    views: {
      'packView@telecom.packs': 'packMigration',
    },
    resolve: {
      packName: /* @ngInject */ ($transition$) =>
        $transition$.params().packName,
    },
  });
};
