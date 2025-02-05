export default class DiagnosticsResultCtrl {
  /* @ngInject */
  constructor(cloudConnectService, cloudConnectDiagnosticsService) {
    this.cloudConnectService = cloudConnectService;
    this.cloudConnectDiagnosticsService = cloudConnectDiagnosticsService;
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
}
