export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('overTheBoxes.overTheBox.autoconfigure', {
    url: '/autoconfigure',
    views: {
      otbView: 'overTheBoxAutoconfigure',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('overTheBox_tabs_autoconfigure'),
    },
  });
};
