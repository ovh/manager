import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, CucCloudMessage, Poller) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.Poller = Poller;
  }

  $onInit() {
    this.isLoading = true;
    this.loadMessages();

    if (this.operation) {
      this.getOperation();
    }
  }

  getOperation() {
    return this.Poller.poll(
      `/cloud/project/${this.projectId}/operation/${get(this.operation, 'id')}`,
      {},
      {
        method: 'get',
        successRule: {
          status: 'completed',
        },
      },
    ).then(
      () => this.onVrackCreated(),
      (error) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_network_private_vrack_error',
            {
              message: get(error, 'data.message', ''),
            },
          ),
        );
      },
      (operation) => {
        this.operation = operation;
        this.isLoading = false;
      },
    );
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.privateNetwork');
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.privateNetwork.vrack',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
