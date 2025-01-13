export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.diagnostics.result', {
    url: '/diagnostics/:diagnosticId/result',
    views: {
      modal: {
        component: 'cloudConnectDiagnosticResult',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToDiagnosticPage) => goToDiagnosticPage,
      diagnostic: /* @ngInject */ (
        $transition$,
        cloudConnectService,
        cloudConnect,
      ) =>
        cloudConnectService.getDiagnostic(
          cloudConnect.id,
          $transition$.params().diagnosticId,
        ),
      diagnosticId: /* @ngInject */ ($transition$) =>
        $transition$.params().diagnosticId,
      breadcrumb: () => null,
    },
  });
};
