import {
  DATA_PROCESSING_STATUS_TO_CLASS,
  DATA_PROCESSING_STATUSES,
} from '../data-processing.constants';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    this.DATA_PROCESSING_STATUS_TO_CLASS = DATA_PROCESSING_STATUS_TO_CLASS;
  }

  getStatusText() {
    const normalizedStatus = this.status.toUpperCase();
    if (normalizedStatus in DATA_PROCESSING_STATUSES) {
      return this.$translate.instant(
        `data_processing_job_status_${this.status.toLowerCase()}`,
      );
    }
    return this.$translate.instant('data_processing_job_status_unknown');
  }

  /**
   * Get a CSS class name from component job status
   * @return {string|any}
   */
  getClassFromStatus(baseName = 'oui-badge_') {
    const normalizedStatus = this.status.toUpperCase();
    if (normalizedStatus in DATA_PROCESSING_STATUS_TO_CLASS) {
      return baseName + DATA_PROCESSING_STATUS_TO_CLASS[normalizedStatus];
    }
    return `${baseName}error`;
  }
}
