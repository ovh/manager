export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-server.server.dashboard.install.choose-source',
    {
      url: '/choose-source',
      views: {
        '@app.dedicated-server': {
          component: 'dedicatedServerInstallChooseSource',
        },
      },
      resolve: {
        goBack: /* @ngInject */ (goToServerDetails) => goToServerDetails,
        user: /* @ngInject */ (currentUser) => currentUser,
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('dedicated_server_install_choose_source_title'),
      },
    },
  );
};
