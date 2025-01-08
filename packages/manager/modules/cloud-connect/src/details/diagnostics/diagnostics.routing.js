export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.diagnostics', {
    url: '/diagnostics',
    component: 'cloudConnectDiagnosticsDetails',
    resolve: {
      diagnosticList: /* @ngInject */ (cloudConnectService, cloudConnect) =>
        cloudConnectService.getDiagnosticsWithDetails(cloudConnect.id),
      refreshDiagnostics: /* @ngInject */ ($state) => () => {
        return $state.reload();
      },
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('cloud_connect_diagnostics'),
    },
  });
};
