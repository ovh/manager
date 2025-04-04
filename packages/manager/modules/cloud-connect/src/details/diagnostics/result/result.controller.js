import {
  TRACKING_PREFIX,
  DIAGNOSTIC_LISTING_TRACKING_CONTEXT,
  getDiagnosticDashboardTrackingContext,
} from '../../../cloud-connect.constants';

export default class DiagnosticResultCtrl {
  /* @ngInject */
  constructor(
    atInternet,
    $timeout,
    $translate,
    cloudConnectService,
    cloudConnectDiagnosticsService,
  ) {
    this.atInternet = atInternet;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.cloudConnectService = cloudConnectService;
    this.cloudConnectDiagnosticsService = cloudConnectDiagnosticsService;
  }

  $onInit() {
    this.canDownload = !!this.diagnostic?.result?.[0]?.output;
    $('.modal-dialog').attr('id', 'ovh-cloudConnect-diagnostic-result-modal');
    this.atInternet.trackPage({
      name: `${TRACKING_PREFIX}cloud-connect::pop-up::see::diagnostic-results-${this.diagnostic.function}`,
      type: 'navigation',
      ...DIAGNOSTIC_LISTING_TRACKING_CONTEXT,
    });
  }

  copyToClipboard(diagnostic) {
    this.atInternet.trackClick({
      name: `${TRACKING_PREFIX}pop-up::button::copy_diagnostic-results-${this.diagnostic.function}`,
      type: 'action',
      ...getDiagnosticDashboardTrackingContext(
        `cloud-connect::pop-up::see::diagnostic-results-${this.diagnostic.function}`,
      ),
    });
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
    this.atInternet.trackClick({
      name: `${TRACKING_PREFIX}pop-up::button::download_diagnostic-results-${this.diagnostic.function}`,
      type: 'action',
      ...getDiagnosticDashboardTrackingContext(
        `cloud-connect::pop-up::see::diagnostic-results-${this.diagnostic.function}`,
      ),
    });
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
