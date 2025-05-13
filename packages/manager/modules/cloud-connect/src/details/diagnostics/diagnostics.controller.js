import {
  TRACKING_PREFIX,
  DIAGNOSTIC_DASHBOARD_TRACKING_CONTEXT,
  getDiagnosticDashboardTrackingContext,
} from '../../cloud-connect.constants';

export default class DiagnosticsResultCtrl {
  /* @ngInject */
  constructor(atInternet, cloudConnectService, cloudConnectDiagnosticsService) {
    this.atInternet = atInternet;
    this.cloudConnectService = cloudConnectService;
    this.cloudConnectDiagnosticsService = cloudConnectDiagnosticsService;
  }

  $onInit() {
    if (this.fromLink) {
      this.atInternet.trackClick({
        name: `${TRACKING_PREFIX}banner::link::go-to-diagnostic-results`,
        type: 'action',
        ...DIAGNOSTIC_DASHBOARD_TRACKING_CONTEXT,
      });
    }

    this.atInternet.trackPage({
      name: `${TRACKING_PREFIX}cloud-connect::dashboard::diagnostics`,
      ...DIAGNOSTIC_DASHBOARD_TRACKING_CONTEXT,
    });
  }

  downloadResult(diagnosticId) {
    this.cloudConnectService
      .getDiagnostic(this.cloudConnect.id, diagnosticId)
      .then((diagnostic) => {
        this.cloudConnectDiagnosticsService.download(
          this.cloudConnect.id,
          diagnostic,
        );
      });
  }

  trackAction(option, diagnosticFunction) {
    this.atInternet.trackClick({
      name: `${TRACKING_PREFIX}datagrid::button::${option}::${diagnosticFunction}`,
      type: 'action',
      ...getDiagnosticDashboardTrackingContext(
        'cloud-connect::dashboard::diagnostics',
      ),
    });
  }
}
