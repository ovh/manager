export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('overTheBoxes.overTheBox.migration', {
    url: '/migration',
    views: {
      otbView: 'overtheboxMigration',
    },
    resolve: {
      goBack: /* @ngInject */ ($state) => () =>
        $state.go('overTheBoxes.overTheBox.details'),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('overthebox_migration_title'),
    },
  });
};
