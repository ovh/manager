export default class {
  /* @ngInject */
  constructor($scope, $state, $timeout, $uibModal, CucCloudMessage, dataProcessingJobLogsService) {
    this.$scope = $scope; // router state
    this.$state = $state; // router state
    this.$timeout = $timeout;
    this.dataProcessingJobLogsService = dataProcessingJobLogsService;
    this.logger = dataProcessingJobLogsService;
    // let's do some binding
    this.downloadLogs = this.downloadLogs.bind(this);
    this.isDownloadButtonDisabled = false;
  }

  $onInit() {
    this.logger.startLogsPolling(this.projectId, this.job.id, 5000, true);
  }

  $onDestroy() {
    this.logger.stopLogsPolling();
  }

  downloadLogs() {
    const re = /https:\/\/storage\.[a-z0-9]+\.cloud.ovh.net\/v1\/AUTH_[a-z0-9]+\/(.*)\/(.*)/;
    const logsUrl = this.logger.logs.logsAddress;
    if (logsUrl !== undefined && logsUrl !== null) {
      const matches = logsUrl.match(re);
      this.logger.downloadObject(this.projectId, this.job.region, matches[1], matches[2]);
      this.isDownloadButtonDisabled = true;
      this.$timeout(() => {
        this.isDownloadButtonDisabled = false;
        this.$scope.$apply();
      }, 3000);
    }
  }
}
