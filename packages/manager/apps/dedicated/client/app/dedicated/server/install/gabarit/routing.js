export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.install.gabarit', {
    url: '/gabarit',
    views: {
      '@app.dedicated-server': {
        component: 'dedicatedServerInstallGabarit',
      },
    },
    params: {
      installSource: null,
    },
    redirectTo: ($transition$) => {
      if ($transition$.params().installSource === null) {
        return {
          state: 'app.dedicated-server.server.install.choose-source',
        };
      }
      return null;
    },
    resolve: {
      goBack: /* @ngInject */ (goToServerDetails) => goToServerDetails,
      user: /* @ngInject */ (currentUser) => currentUser,
      installSource: /* @ngInject */ ($transition$) =>
          $transition$.params().installSource,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dedicated_server_install_gabarit_title'),
    },
  });
};
