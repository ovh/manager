export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.dashboard.netboot', {
    url: '/netboot',
    views: {
      '@app.dedicated-server': {
        component: 'dedicatedServerNetboot',
      },
    },
    resolve: {
      goBack: /* @ngInject */ (goToServerDetails) => (
        message,
        type = 'DONE',
        reload = true,
      ) => goToServerDetails(message, type, reload),
      user: /* @ngInject */ (currentUser) => currentUser,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('server_configuration_netboot_title'),
    },
  });
};
