export default class DiagnosticResultCtrl {
  /* @ngInject */
  constructor(
    $timeout,
    $translate,
    cloudConnectService,
    cloudConnectDiagnosticsService,
  ) {
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.cloudConnectService = cloudConnectService;
    this.cloudConnectDiagnosticsService = cloudConnectDiagnosticsService;
  }

  copyToClipboard(diagnostic) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        navigator.clipboard.writeText(diagnostic.result[0].output);
        this.copyDone = true;
        this.$timeout(() => {
          this.copyDone = false;
        }, 500);
      } catch (error) {
        return error;
      }
    }
    return '';
  }

  download(diagnostic) {
    return this.cloudConnectDiagnosticsService.download(diagnostic);
  }
}
