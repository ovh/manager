import { DIAGNOSTIC_TRACKING_PREFIX } from '../../cloud-connect.constants';

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
        name: `${DIAGNOSTIC_TRACKING_PREFIX}banner::link::go-to-diagnostic-results`,
        type: 'action',
        level2: 99,
      });
    }
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
      name: `${DIAGNOSTIC_TRACKING_PREFIX}datagrid::button::${option}::${diagnosticFunction}`,
      type: 'action',
      level2: 99,
    });
  }
}
