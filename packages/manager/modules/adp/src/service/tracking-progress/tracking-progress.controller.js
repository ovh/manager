import find from 'lodash/find';
import sumBy from 'lodash/sumBy';

export default class {
  /* @ngInject */
  constructor($state, $stateParams, adpService, CucControllerHelper, CucServiceHelper,
    CucCloudPoll, ADP_STATUS_MAP, ADP_STATUS) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.CucCloudPoll = CucCloudPoll;
    this.adpService = adpService;
    this.ADP_STATUS_MAP = ADP_STATUS_MAP;
    this.ADP_STATUS = ADP_STATUS;
    this.cucControllerHelper = CucControllerHelper;
    this.cucServiceHelper = CucServiceHelper;
    this.serviceName = this.$stateParams.serviceName;
    this.details = null;
    this.globalProgress = 0;
  }

  $onInit() {
    this.getProgress()
      .then((tasks) => {
        if (!find(tasks, task => this.adpService.isDeploymentInProgress(task))) {
          this.$state.go('adp.service.details');
        } else {
          this.fetchAccountDetails();
          this.handleOperation(this.serviceName);
        }
      });
  }

  getProgress() {
    this.progress = this.cucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.adpService.getStatus(this.serviceName)
        .then((tasks) => { this.calculateGlobalProgress(tasks); return tasks; })
        .catch(error => this.cucServiceHelper.errorHandler('adp_tracking_progress_get_status_error')(error)),
    });
    return this.progress.load();
  }

  /**
   * fetch the account details
   *
   * @returns the account details
   */
  fetchAccountDetails() {
    this.accountDetails = this.cucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.adpService.getAccountDetails()
        .catch(error => this.cucServiceHelper.errorHandler('adp_get_account_details_error')(error)),
    });
    return this.accountDetails.load();
  }

  fetchPlatformDetail() {
    this.platformDetail = this.cucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.adpService.getAdpDetails(this.serviceName)
        .catch(error => this.cucServiceHelper.errorHandler('adp_get_platform_error')(error)),
    });
    return this.platformDetail.load();
  }

  /**
   * Calculate global progress based on individual task progress
   *
   */
  calculateGlobalProgress(tasks) {
    const totalPercentage = sumBy(tasks, 'percentage');
    this.globalProgress = Math.floor(totalPercentage / tasks.length);
  }

  /**
   * Polls progress API untill it returns success or failure
   *
   */
  pollOperation(serviceName) {
    return this.CucCloudPoll.poll({
      item: { id: serviceName },
      pollFunction: () => this.getProgress(serviceName),
      stopCondition: tasks => !find(tasks, task => this.adpService.isDeploymentInProgress(task)),
    });
  }

  /**
   * handles checking status of cluster function.
   * Repeatedly polls for operation until it returns DEPLOYED message.
   *
   * @param {any} serviceName
   * @returns promise which will be resolved to operation object
   */
  handleOperation(serviceName) {
    return this.pollOperation(serviceName)
      .$promise
      .then((pollResult) => {
        if (pollResult[0].item.status === this.ADP_STATUS.DEPLOYED) {
          return this.$state.go('adp.service.details');
        }
        return this.cucServiceHelper.errorHandler('adp_tracking_progress_deploy_error');
      });
  }
}
