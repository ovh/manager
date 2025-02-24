export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.diagnostics.result', {
    url: '/diagnostics/:diagnosticId/result',
    views: {
      modal: {
        component: 'cloudConnectDiagnosticResult',
      },
    },
    layout: 'modal',
    atInternet: {
      ignore: true,
    },
    resolve: {
      goBack: /* @ngInject */ (goToDiagnosticPage) => goToDiagnosticPage,
      diagnosticId: /* @ngInject */ ($transition$) =>
        $transition$.params().diagnosticId,
      diagnostic: /* @ngInject */ (
        cloudConnectService,
        cloudConnect,
        diagnosticId,
      ) => cloudConnectService.getDiagnostic(cloudConnect.id, diagnosticId),
      breadcrumb: () => null,
    },
  });
};
