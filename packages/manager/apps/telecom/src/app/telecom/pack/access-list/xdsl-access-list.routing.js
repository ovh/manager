export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.xdsl-access-list', {
    url: '/xdsl-access-list',
    views: {
      'telecomView@telecom': 'xdslAccessList',
    },
    resolve: {
      hideBreadcrumb: () => true,
    },
  });
};
