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
    $interval,
  ) {
    this.dataProcessingService = dataProcessingService;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.atInternet = atInternet;
    this.$interval = $interval;
    this.NOTEBOOK_CLUSTER_NAME = NOTEBOOK_CLUSTER_NAME;
    this.capitalize = capitalize;
    this.convertToGio = convertToGio;

    this.pollData = () => {
      this.dataProcessingService
        .getNotebook(this.projectId, this.notebook.id)
        .then((notebook) => {
          this.notebook = notebook;
          if (
            !DATA_PROCESSING_NOTEBOOKS_TRANSITION_STATUSES.includes(
              notebook.status.state,
            )
          ) {
            this.stopPollData();
          }
        });
    };
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
      this.pollTimer = this.$interval(this.pollData, NOTEBOOK_REFRESH_INTERVAL);
    }
  }

  $onDestroy() {
    if (this.pollTimer !== null) {
      this.stopPollData();
    }
  }

  stopPollData() {
    this.$interval.cancel(this.pollTimer);
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
    this.trackNotebooks(`notebook-details::dashboard::start-notebook`);
    this.dataProcessingService
      .startNotebook(this.projectId, this.notebook.id)
      .then(() => {
        this.reloadState();
      });
  }

  onNotebookStopClick() {
    this.trackNotebooks(`notebook-details::dashboard::stop-notebook`);
    this.terminateNotebook();
  }

  onDeleteNotebookClick() {
    this.trackNotebooks('notebook-details::dashboard::delete-notebook');
    this.deleteNotebook();
  }

  onOpenJupyterLab() {
    this.trackNotebooks('notebook-details::dashboard::goto-jupyterlab');
    this.openLiveCodeEditor();
  }
}
