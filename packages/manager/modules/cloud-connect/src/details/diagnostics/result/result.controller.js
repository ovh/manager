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

  $onInit() {
    this.canDownload = !!(this.diagnostic.result?.length > 0);
    $('.modal-dialog').attr('id', 'ovh-cloudConnect-diagnostic-result-modal');
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
    return this.cloudConnectDiagnosticsService.download(
      this.cloudConnect.id,
      diagnostic,
    );
  }

  getLog() {
    if (this.canDownload) {
      return this.diagnostic.result[0].output;
    }
    return this.$translate.instant('cloud_connect_diagnostics_result_no_log');
  }
}
