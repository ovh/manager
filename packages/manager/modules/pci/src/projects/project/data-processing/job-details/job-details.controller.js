import {
  DATA_PROCESSING_STATUS_TO_CLASS,
  DATA_PROCESSING_UI_URL,
  DATA_PROCESSING_STATUSES,
} from '../data-processing.constants';

export default class {
  /* @ngInject */
  constructor($state, $uibModal, CucCloudMessage, dataProcessingService, CucRegionService) {
    this.$state = $state; // router state
    this.cucCloudMessage = CucCloudMessage;
    this.dataProcessingService = dataProcessingService;
    this.cucRegionService = CucRegionService;
    this.DATA_PROCESSING_STATUS_TO_CLASS = DATA_PROCESSING_STATUS_TO_CLASS;
    this.DATA_PROCESSING_UI_URL = DATA_PROCESSING_UI_URL;
  }

  /**
   * Load a modal asking confirmation to terminate current job
   */
  terminateJob() {
    this.$state.go('pci.projects.project.data-processing.job-details.dashboard.terminate', {
      projectId: this.projectId,
      jobId: this.job.id,
      jobName: this.job.name,
    });
  }
}
