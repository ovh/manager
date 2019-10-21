import { KIND, STATUS } from './streams.constants';

export default class PciStreamsController {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    CucRegionService,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
  }

  $onInit() {
    this.loadMessages();

    this.kindOptions = {
      values: {
        [KIND.NON_PERSISTENT]: this.$translate.instant(`pci_projects_project_streams_kind_${KIND.NON_PERSISTENT}`),
        [KIND.PERSISTENT]: this.$translate.instant(`pci_projects_project_streams_kind_${KIND.PERSISTENT}`),
      },
    };

    this.statusOptions = {
      values: {
        [STATUS.INSTALLING]: this.$translate.instant(`pci_projects_project_streams_status_${STATUS.INSTALLING}`),
        [STATUS.RUNNING]: this.$translate.instant(`pci_projects_project_streams_status_${STATUS.RUNNING}`),
        [STATUS.ERROR]: this.$translate.instant(`pci_projects_project_streams_status_${STATUS.ERROR}`),
      },
    };
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.streams',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
