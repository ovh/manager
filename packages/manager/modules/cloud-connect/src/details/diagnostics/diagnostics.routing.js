export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.diagnostics', {
    url: '/diagnostics?{fromLink:boolean}',
    component: 'cloudConnectDiagnosticsDetails',
    atInternet: {
      ignore: true,
    },
    resolve: {
      diagnosticList: /* @ngInject */ (cloudConnectService, cloudConnect) =>
        cloudConnectService.getDiagnosticsWithDetails(cloudConnect.id),
      goToDiagnosticPage: /* @ngInject */ ($state) => () =>
        $state.go('cloud-connect.details.diagnostics'),
      gotoDiagnosticResult: /* @ngInject */ ($state) => (diagnosticId) =>
        $state.go('cloud-connect.details.diagnostics.result', {
          diagnosticId,
        }),
      refreshDiagnostics: /* @ngInject */ ($state) => () => {
        return $state.reload();
      },
      fromLink: /* @ngInject */ ($transition$) =>
        $transition$.params().fromLink,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('cloud_connect_diagnostics'),
    },
  });
};
