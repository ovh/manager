export default class {
  /* @ngInject */
  constructor($translate, CucCloudMessage, DatabaseService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.messageContainer =
      'pci.projects.project.storages.databases.dashboard.connectors.add';
    this.loadMessages();
    this.trackDashboard('connector-config', 'page');
    this.model = {};
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(this.messageContainer);
    this.messageHandler = this.CucCloudMessage.subscribe(
      this.messageContainer,
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getModelValue() {
    const configuration = {};
    Object.keys(this.model).forEach((field) => {
      if (![null, undefined, ''].includes(this.model[field])) {
        configuration[field] = `${this.model[field]}`;
      }
    });
    return {
      configuration,
      name: this.model.name,
      connectorId: this.availableConnector.id,
    };
  }

  addConnector() {
    return this.DatabaseService.postConnector(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.getModelValue(),
    )
      .then(() =>
        this.goBack({
          textHtml: this.$translate.instant(
            'pci_databases_connectors_add_success_message',
          ),
        }),
      )
      .catch((err) =>
        // this.goBack(
        {
          this.CucCloudMessage.flushMessages(this.messageContainer);
          this.CucCloudMessage.error(
            {
              textHtml: this.$translate.instant(
                'pci_databases_connectors_add_error_message',
                {
                  message: err.data?.message || null,
                  details: err.data?.details?.error || null,
                },
              ),
            },
            this.messageContainer,
          );
        },
      );
  }
}
