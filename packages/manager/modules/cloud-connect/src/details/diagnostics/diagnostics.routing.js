export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.diagnostics', {
    url: '/diagnostics',
    component: 'cloudConnectDiagnosticsDetails',
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
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('cloud_connect_diagnostics'),
    },
  });
};
