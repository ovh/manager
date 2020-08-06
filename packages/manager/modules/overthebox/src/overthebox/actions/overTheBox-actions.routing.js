export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('overTheBoxes.overTheBox.actions', {
    url: '/actions',
    views: {
      otbView: 'overTheBoxActions',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('overTheBox_actions_list'),
    },
  });
};
