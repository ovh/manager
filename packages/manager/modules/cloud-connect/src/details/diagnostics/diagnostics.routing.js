export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.diagnostics', {
    url: '/diagnostics',
    component: 'cloudConnectDetailsDiagnostics',
    resolve: {
      diagnosticList: /* @ngInject */ (cloudConnectService, cloudConnect) =>
        cloudConnectService.getAllDiagnostics(cloudConnect.id),
      refreshDiagnostics: /* @ngInject */ ($state) => () => {
        return $state.reload();
      },
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('cloud_connect_diagnostics'),
    },
  });
};
