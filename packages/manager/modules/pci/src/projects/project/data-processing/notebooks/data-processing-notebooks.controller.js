import capitalize from 'lodash/capitalize';
import {
  isNotebookRunning,
  getClassFromStatus,
} from '../data-processing.utils';
import {
  DATA_PROCESSING_GUIDE_URL,
  NOTEBOOK_REFRESH_INTERVAL,
} from '../data-processing.constants';

export default class DataProcessingNotebooksCtrl {
  /* @ngInject */
  constructor(
    CucCloudMessage,
    dataProcessingService,
    ovhManagerRegionService,
    atInternet,
    $interval,
    $window,
  ) {
    this.cucCloudMessage = CucCloudMessage;
    this.dataProcessingService = dataProcessingService;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.atInternet = atInternet;
    this.isNotebookRunning = isNotebookRunning;
    this.getClassFromStatus = getClassFromStatus;
    this.guideUrl = DATA_PROCESSING_GUIDE_URL;
    this.capitalize = capitalize;
    this.$interval = $interval;
    this.$window = $window;
  }

  $onInit() {
    this.subscribeToMessages();
    this.formatDuration = DataProcessingNotebooksCtrl.formatDuration;

    this.pollTimer = this.$interval(
      () => this.pollData(),
      NOTEBOOK_REFRESH_INTERVAL,
    );
  }

  $onDestroy() {
    if (this.pollTimer !== null) {
      this.$interval.cancel(this.pollTimer);
    }
  }

  pollData() {
    this.dataProcessingService
      .getNotebooks(this.projectId)
      .then((notebooks) => {
        this.notebooks = notebooks;
      });
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }

  subscribeToMessages() {
    const channel = 'pci.projects.project.data-processing.notebooks';
    this.cucCloudMessage.unSubscribe(channel);
    this.messageHandler = this.cucCloudMessage.subscribe(channel, {
      onMessage: () => this.refreshMessage(),
    });
  }

  /**
   * Start a notebook
   * @param notebook Object the notebook we want to start
   * @return {*|Promise<any>}
   */
  startNotebook(notebook) {
    this.trackNotebooks(`start-notebook`);
    return this.dataProcessingService
      .startNotebook(this.projectId, notebook.id)
      .then(this.reloadState());
  }

  static formatDuration(dt) {
    const duration = moment.duration(dt, 'seconds');
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();
    return `${days}d ${hours}h ${minutes}mn`;
  }

  onSubmitClick() {
    this.trackNotebooks(`add-notebook`);
    this.addNotebook();
  }

  onDeleteClick(notebookId) {
    this.trackNotebooks(`delete-notebook`);
    this.deleteNotebook(notebookId);
  }

  onTerminateClick(notebookId) {
    this.trackNotebooks(`stop-notebook`);
    this.terminateNotebook(notebookId);
  }

  onShowNotebook(notebookId) {
    this.trackNotebooks(`details-notebook`);
    this.showNotebook(notebookId);
  }

  onShowJupyterLab(jupyterLabUrl) {
    this.trackNotebooks(`goto-jupyterlab`);
    this.$window.open(jupyterLabUrl, '_blank');
  }
}
