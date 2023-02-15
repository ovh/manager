import capitalize from 'lodash/capitalize';
import {
  DATA_PROCESSING_NOTEBOOKS_STATUSES,
  DATA_PROCESSING_NOTEBOOKS_TRANSITION_STATUSES,
  NOTEBOOK_CLUSTER_NAME,
  NOTEBOOK_REFRESH_INTERVAL,
} from '../../data-processing.constants';
import { convertToGio } from '../../data-processing.utils';

export default class NoteBookDetailsCtrl {
  /* @ngInject */
  constructor(
    dataProcessingService,
    ovhManagerRegionService,
    atInternet,
    $timeout,
  ) {
    this.dataProcessingService = dataProcessingService;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.atInternet = atInternet;
    this.$timeout = $timeout;
    this.NOTEBOOK_CLUSTER_NAME = NOTEBOOK_CLUSTER_NAME;
    this.capitalize = capitalize;
    this.convertToGio = convertToGio;
  }

  $onInit() {
    const e = this.capabilities.find(
      (capability) => capability.name === this.notebook.spec.env.engineName,
    );
    this.templates = e.templates;

    if (
      DATA_PROCESSING_NOTEBOOKS_TRANSITION_STATUSES.includes(
        this.notebook.status.state,
      )
    ) {
      this.pollData();
    }
  }

  $onDestroy() {
    if (this.pollTimer !== null) {
      this.$timeout.cancel(this.pollTimer);
    }
  }

  pollData() {
    this.dataProcessingService
      .getNotebook(this.projectId, this.notebook.id)
      .then((notebook) => {
        this.notebook = notebook;
        if (
          DATA_PROCESSING_NOTEBOOKS_TRANSITION_STATUSES.includes(
            notebook.status.state,
          )
        ) {
          this.pollTimer = this.$timeout(
            () => this.pollData(),
            NOTEBOOK_REFRESH_INTERVAL,
          );
        }
      });
  }

  /**
   * Whether current job is in a (pre-)running state
   * @return {boolean} true if job is Submitted, Pending, Running
   */
  isNotebookRunning() {
    return [
      DATA_PROCESSING_NOTEBOOKS_STATUSES.STARTING,
      DATA_PROCESSING_NOTEBOOKS_STATUSES.RUNNING,
    ].includes(this.notebook.status.state);
  }

  onNotebookStartClick() {
    this.trackNotebooks({ name: `start-notebook`, type: 'action' });
    this.dataProcessingService
      .startNotebook(this.projectId, this.notebook.id)
      .then(() => {
        this.reloadState();
      });
  }

  onNotebookStopClick() {
    this.trackNotebooks(`stop-notebook`);
    this.terminateNotebook();
  }
}
