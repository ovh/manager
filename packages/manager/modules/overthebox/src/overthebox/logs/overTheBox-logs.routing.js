export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('overTheBoxes.overTheBox.logs', {
    url: '/logs',
    views: {
      otbView: 'overTheBoxLogs',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('overTheBox_logs_breadcrumb'),
    },
  });
};
