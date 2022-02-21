import { FIELD_TYPES } from './advanced-configuration.constants';

export default class {
  /* @ngInject */
  constructor($translate, CucCloudMessage, DatabaseService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.DatabaseService = DatabaseService;
    this.FIELD_TYPES = FIELD_TYPES;
  }

  $onInit() {
    this.trackDashboard('advanced-configuration', 'page');
    this.messageContainer =
      'pci.projects.project.storages.databases.dashboard.advanced-configuration';
    this.loadMessages();
    this.model = [];
    // add existing advanced configuration to model
    Object.keys(this.advancedConfiguration).forEach((field) => {
      const keyConfig = this.advancedConfigurationList.find(
        (prop) => prop.name === field,
      );
      let value = this.advancedConfiguration[field];
      switch (keyConfig.type) {
        case FIELD_TYPES.boolean:
          value = value === 'true';
          break;
        case FIELD_TYPES.long:
          value = parseInt(value, 10);
          break;
        case FIELD_TYPES.double:
          value = parseFloat(value);
          break;
        default:
          break;
      }
      this.model.push({
        key: keyConfig,
        value,
        added: true,
        isFixed: true,
      });
    });
    this.getAddableProperties();
    if (this.addableProperties.length > 0) {
      this.model.push({});
    }
  }

  getAdvancedConfigModel() {
    const advancedJson = {};
    this.model.forEach((entry) => {
      if (entry?.key?.name && entry?.value)
        advancedJson[entry.key.name] = `${entry.value}`;
    });
    return advancedJson;
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(this.messageContainer);
    this.messageHandler = this.CucCloudMessage.subscribe(
      this.messageContainer,
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getAddableProperties() {
    this.addableProperties = this.advancedConfigurationList.filter(
      (field) => !this.model.find((config) => config?.key?.name === field.name),
    );
  }

  onAddConfig($index) {
    this.model[$index].added = true;
    this.model.push({});
    this.getAddableProperties();
  }

  onRemoveConfig($index) {
    this.model.splice($index, 1);
    this.getAddableProperties();
  }

  onTypeChanged(modelValue, $index) {
    // reset value on field change to avoid invalid data
    this.model[$index].value = undefined;
  }

  updateAdvancedConfiguration() {
    this.pending = true;
    this.DatabaseService.editAdvancedConfiguration(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.getAdvancedConfigModel(),
    )
      .then((database) =>
        this.goBackToAdvancedConfiguration({
          textHtml: this.$translate.instant(
            'pci_databases_advanced_configuration_update_success_message',
            {
              database,
            },
          ),
        }),
      )
      .catch((err) =>
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_databases_advanced_configuration_update_error_message',
            {
              message: err.data?.message || null,
            },
          ),
          this.messageContainer,
        ),
      )
      .finally(() => {
        this.pending = false;
      });
  }
}
