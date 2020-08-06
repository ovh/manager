export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('overTheBoxes.overTheBox.remote', {
    url: '/remote',
    views: {
      otbView: 'overTheBoxRemote',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('overTheBox_remote'),
    },
  });
};
