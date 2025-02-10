import {
  DIAGNOSTIC_TRACKING_PREFIX,
  DIAGNOSTIC_DASHBOARD_TRACKING_CONTEXT,
} from '../../cloud-connect.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.diagnostics', {
    url: '/diagnostics?{fromLink:boolean}',
    component: 'cloudConnectDiagnosticsDetails',
    atInternet: {
      rename: `${DIAGNOSTIC_TRACKING_PREFIX}cloud-connect::dashboard::diagnostics`,
      ...DIAGNOSTIC_DASHBOARD_TRACKING_CONTEXT,
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
