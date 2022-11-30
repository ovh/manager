import {
  DATA_PROCESSING_NOTEBOOKS_STATUS_TO_CLASS,
  DATA_PROCESSING_NOTEBOOKS_STATUSES,
} from '../../data-processing.constants';

export default class NotebookStatusCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    this.DATA_PROCESSING_NOTEBOOKS_STATUS_TO_CLASS = DATA_PROCESSING_NOTEBOOKS_STATUS_TO_CLASS;
  }

  getStatusText() {
    const normalizedStatus = this.status.toUpperCase();
    if (normalizedStatus in DATA_PROCESSING_NOTEBOOKS_STATUSES) {
      return this.$translate.instant(
        `data_processing_notebook_status_${this.status.toLowerCase()}`,
      );
    }
    return this.$translate.instant('data_processing_notebook_status_unknown');
  }

  /**
   * Get a CSS class name from component notebook status
   * @return {string|any}
   */
  getClassFromStatus(baseName = 'oui-badge_') {
    const normalizedStatus = this.status.toUpperCase();
    if (normalizedStatus in DATA_PROCESSING_NOTEBOOKS_STATUS_TO_CLASS) {
      return (
        baseName + DATA_PROCESSING_NOTEBOOKS_STATUS_TO_CLASS[normalizedStatus]
      );
    }
    return `${baseName}error`;
  }
}
