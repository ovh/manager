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
    this.trackDashboard('connectors::edit', 'page');
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
    let apiMessages = null;
    if (err?.data?.details?.error) {
      apiMessages = JSON.parse(err.data.details.error);
    } else if (err?.data?.message) {
      try {
        apiMessages = JSON.parse(err.data.message);
      } catch (e) {
        return `<br/><ul><li>${err.data.message}</li></ul>`;
      }
    }
    if (apiMessages) {
      message += '<br/><ul>';
      apiMessages.errors.forEach((error) => {
        message += `<li>${error.message.replace(/"/g, '')}</li>`;
      });
      message += '</ul>';
    }
    return message;
  }

  updateConnector() {
    this.trackDashboard('connectors::edit::validate');
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
                details: this.getErrorsMessages(err),
              },
            ),
          },
          this.messageContainer,
        );
      });
  }
}
