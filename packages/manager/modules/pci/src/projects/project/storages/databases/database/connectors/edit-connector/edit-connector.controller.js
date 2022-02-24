export default class EditConnectorCtrl {
  /* @ngInject */
  constructor($translate, CucCloudMessage, DatabaseService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.DatabaseService = DatabaseService;
    this.getErrorsMessages = EditConnectorCtrl.getErrorsMessages;
  }

  $onInit() {
    this.messageContainer =
      'pci.projects.project.storages.databases.dashboard.connectors.edit';
    this.loadMessages();
    this.trackDashboard('connector-config', 'page');
    this.model = {
      ...this.connector.configuration,
    };
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
    return { configuration };
  }

  static getErrorsMessages(err) {
    let message = ``;
    if (err?.data?.details?.error) {
      const messages = JSON.parse(err.data.details.error);
      message += '<br/><ul>';
      messages.errors.forEach((error) => {
        message += `<li>${error.message}</li>`;
      });
      message += '</ul>';
    }
    return message;
  }

  updateConnector() {
    return this.DatabaseService.putConnector(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.connector.id,
      this.getModelValue(),
    )
      .then(() =>
        this.goBack({
          textHtml: this.$translate.instant(
            'pci_databases_connectors_edit_success_message',
          ),
        }),
      )
      .catch((err) => {
        this.CucCloudMessage.flushMessages(this.messageContainer);
        this.CucCloudMessage.error(
          {
            textHtml: this.$translate.instant(
              'pci_databases_connectors_edit_error_message',
              {
                message: err.data?.message || null,
                details: this.getErrorsMessages(err),
              },
            ),
          },
          this.messageContainer,
        );
      });
  }
}
