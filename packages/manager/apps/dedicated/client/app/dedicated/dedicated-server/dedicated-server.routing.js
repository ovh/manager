export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server', {
    url: '',
    template: '<div ui-view></div>',
    redirectTo: 'app.dedicated-server.index',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dedicated_servers_title'),
    },
  });
};
