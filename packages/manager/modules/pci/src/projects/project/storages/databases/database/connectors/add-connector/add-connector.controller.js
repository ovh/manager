import { GROUP_NAMES_WITH_MESSAGES } from '../../../../../../../components/project/storages/databases/connectors.constants';

export default class AddConnectorCtrl {
  /* @ngInject */
  constructor($translate, CucCloudMessage, DatabaseService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.DatabaseService = DatabaseService;
    this.getErrorsMessages = AddConnectorCtrl.getErrorsMessages;
    this.groupNames = GROUP_NAMES_WITH_MESSAGES;
  }

  $onInit() {
    this.messageContainer =
      'pci.projects.project.storages.databases.dashboard.connectors.add';
    this.loadMessages();
    this.trackDashboard('connectors::add_a_connector::parameters', 'page');
    this.model = {};
    this.requiredFields = this.availableConnector.configuration.getRequiredFields();
  }

  cancel() {
    this.trackDashboard(
      'connectors::add_connector_parameters::go_back_to_connectors',
    );
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
    return {
      configuration,
      name: this.model.name,
      connectorId: this.availableConnector.id,
    };
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

  addConnector() {
    this.trackDashboard('connectors::add_connector_parameters::confirm');
    this.trackDatabases(
      `databases_Kafka_Connect_add_a_connector::${this.availableConnector.type}::${this.availableConnector.name}::confirm_parameters`,
      'action',
      false,
    );
    return this.DatabaseService.postConnector(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.getModelValue(),
    )
      .then(() => {
        this.trackDashboard('connectors::add_connector_validate', 'page');
        this.trackDatabases(
          `databases_Kafka_Connect_add_a_connector::${this.availableConnector.type}::${this.availableConnector.name}::validate`,
          'page',
          false,
        );
        return this.goBack({
          textHtml: this.$translate.instant(
            'pci_databases_connectors_add_success_message',
          ),
        });
      })
      .catch((err) => {
        this.trackDashboard('connectors::add_connector_error', 'page');
        this.trackDatabases(
          `databases_Kafka_Connect_add_a_connector::${this.availableConnector.type}::${this.availableConnector.name}::error`,
          'page',
          false,
        );

        this.CucCloudMessage.flushMessages(this.messageContainer);
        this.CucCloudMessage.error(
          {
            textHtml: this.$translate.instant(
              'pci_databases_connectors_add_error_message',
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
