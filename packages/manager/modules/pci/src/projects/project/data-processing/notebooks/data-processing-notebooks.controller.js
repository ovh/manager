import {
  isNotebookRunning,
  getClassFromStatus,
} from '../data-processing.utils';
import { DATA_PROCESSING_GUIDE_URL } from '../data-processing.constants';

export default class {
  /* @ngInject */
  constructor(
    $state,
    CucCloudMessage,
    dataProcessingService,
    ovhManagerRegionService,
    atInternet,
  ) {
    this.$state = $state;
    this.cucCloudMessage = CucCloudMessage;
    this.dataProcessingService = dataProcessingService;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.atInternet = atInternet;
    this.isNotebookRunning = isNotebookRunning;
    this.getClassFromStatus = getClassFromStatus;
    this.guideUrl = DATA_PROCESSING_GUIDE_URL;
  }

  $onInit() {
    this.subscribeToMessages();
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
    return this.dataProcessingService.startNotebook(
      this.projectId,
      notebook.id,
    );
  }

  // eslint-disable-next-line class-methods-use-this
  formatDuration(dt) {
    // this method needs to use current instance of moment, so it cannot static
    const duration = moment.duration(dt);
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();
    return `${days}d ${hours}h ${minutes}mn`;
  }

  onSubmitClick() {
    this.atInternet.trackClick({
      name:
        'public-cloud::pci::projects::project::data-processing::add-notebook',
      type: 'action',
    });
    this.addNotebook();
  }
}
