import { GROUP_NAMES_WITH_MESSAGES } from '../../../../../../../components/project/storages/databases/connectors.constants';

export default class EditConnectorCtrl {
  /* @ngInject */
  constructor($translate, CucCloudMessage, DatabaseService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.DatabaseService = DatabaseService;
    this.getErrorsMessages = EditConnectorCtrl.getErrorsMessages;
    this.groupNames = GROUP_NAMES_WITH_MESSAGES;
  }

  $onInit() {
    this.messageContainer =
      'pci.projects.project.storages.databases.dashboard.connectors.edit';
    this.loadMessages();
    this.trackDashboard('connectors::modify_connector', 'page');
    this.model = {
      ...this.connector.configuration,
    };
    this.requiredFields = this.availableConnector.configuration.getRequiredFields();
  }

  cancel() {
    this.trackDashboard('connectors::actions_menu::modify_cancel');
    return this.goBack();
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

  areRequiredFieldsFilled() {
    return this.requiredFields.every(
      ({ name }) => this.model[name] != null && this.model[name] !== '',
    );
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
    if (err?.data?.details) {
      apiMessages = Object.values(err?.data?.details);
    } else if (err?.data?.details?.message) {
      apiMessages = err.data.details.message;
    } else if (err?.data?.message) {
      return `<br/><ul><li>${err.data.message}</li></ul>`;
    }
    if (apiMessages) {
      message += '<br/><ul>';
      apiMessages.forEach((error) => {
        message += `<li>${error.replace(/"/g, '')}</li>`;
      });
      message += '</ul>';
    }
    return message;
  }

  updateConnector() {
    this.trackDashboard('connectors::actions_menu::modify_confirm');
    return this.DatabaseService.putConnector(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.connector.id,
      this.getModelValue(),
    )
      .then(() => {
        this.trackDashboard('connectors::modify_connector_validate', 'page');
        return this.goBack({
          textHtml: this.$translate.instant(
            'pci_databases_connectors_edit_success_message',
          ),
        });
      })
      .catch((err) => {
        this.trackDashboard('connectors::modify_connector_error', 'page');
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
