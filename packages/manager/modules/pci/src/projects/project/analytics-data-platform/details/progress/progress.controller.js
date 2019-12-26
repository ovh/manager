import reduce from 'lodash/reduce';
import sumBy from 'lodash/sumBy';

import {
  ANALYTICS_DATA_PLATFORM_STATUS_MAP,
  ANALYTICS_DATA_PLATFORM_STATUS,
} from '../../analytics-data-platform.constants';

export default class {
  /* @ngInject */
  constructor(
    analyticsDataPlatformService,
    CucControllerHelper,
    CucCloudMessage,
    CucServiceHelper,
    CucCloudPoll,
  ) {
    this.CucCloudPoll = CucCloudPoll;
    this.analyticsDataPlatformService = analyticsDataPlatformService;
    this.ANALYTICS_DATA_PLATFORM_STATUS_MAP = ANALYTICS_DATA_PLATFORM_STATUS_MAP;
    this.ANALYTICS_DATA_PLATFORM_STATUS = ANALYTICS_DATA_PLATFORM_STATUS;
    this.cucControllerHelper = CucControllerHelper;
    this.cucServiceHelper = CucServiceHelper;
    this.cucCloudMessage = CucCloudMessage;
    this.globalProgress = 0;
  }

  $onInit() {
    this.calculateGlobalProgress(this.progress);
    this.handleOperation(this.serviceName);
    this.subscribeToMessages();
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }

  subscribeToMessages() {
    this.cucCloudMessage.unSubscribe(
      'pci.projects.project.analytics-data-platform.details.progress',
    );
    this.messageHandler = this.cucCloudMessage.subscribe(
      'pci.projects.project.analytics-data-platform.details.progress',
      { onMessage: () => this.refreshMessage() },
    );
  }

  /**
   * Calculate global progress based on individual task progress
   *
   */
  calculateGlobalProgress(tasks) {
    if (tasks.length) {
      const totalPercentage = sumBy(tasks, 'percentage');
      this.globalProgress = Math.floor(totalPercentage / tasks.length);
    } else {
      this.globalProgress = 0;
    }
  }

  /**
   * handles checking status of cluster function.
   * Repeatedly polls for operation until it returns DEPLOYED message.
   *
   * @param {any} serviceName
   * @returns promise which will be resolved to operation object
   */
  handleOperation(serviceName) {
    return this.analyticsDataPlatformService
      .getDeploymentStatus(serviceName)
      .then(
        (tasks) => {
          const deploymentSuccessful = reduce(
            tasks,
            (deploySuccessful, task) =>
              deploySuccessful &&
              task.status === ANALYTICS_DATA_PLATFORM_STATUS.SUCCEEDED,
            true,
          );
          return deploymentSuccessful
            ? this.goToServicePage(serviceName)
            : this.cucServiceHelper.errorHandler(
                'analytics_data_platform_tracking_progress_deploy_error',
              )();
        },
        () =>
          this.cucServiceHelper.errorHandler(
            'analytics_data_platform_tracking_progress_deploy_error',
          )(),
        (tasks) => {
          this.calculateGlobalProgress(tasks);
          this.progress = tasks;
        },
      );
  }
}
