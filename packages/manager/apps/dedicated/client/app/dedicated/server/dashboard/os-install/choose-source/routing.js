export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.dashboard.os-install-from', {
    url: '/os-install/choose-source',
    views: {
      'dashboard@app.dedicated-server.server.dashboard': 'dedicatedServerOsInstallChooseSource',
    },
    resolve: {
      goBack: /* @ngInject */ (goToDashboard) => goToDashboard,
      user: /* @ngInject */ (currentUser) => currentUser,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dedicated_server_dashboard_os_install_from'),
    },
  });
};
