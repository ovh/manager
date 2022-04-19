import { FIELD_TYPES } from './advanced-configuration.constants';

export default class AdvancedConfigurationCtrl {
  /* @ngInject */
  constructor($translate, CucCloudMessage, DatabaseService, $timeout) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.DatabaseService = DatabaseService;
    this.FIELD_TYPES = FIELD_TYPES;
    this.$timeout = $timeout;
  }

  $onInit() {
    this.trackDashboard('advanced_config', 'page');
    this.messageContainer =
      'pci.projects.project.storages.databases.dashboard.advanced-configuration';
    this.loadMessages();
    this.model = this.initModelFromAdvancedConfig();
    this.addEmptyEntry();
  }

  initModelFromAdvancedConfig() {
    const model = [];
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
      model.push({
        key: keyConfig,
        value,
        added: true,
        isFixed: true,
      });
    });
    return model;
  }

  addEmptyEntry() {
    this.getAddableProperties();
    if (this.addableProperties.length > 0) {
      this.model.push({});
    }
  }

  getAdvancedConfigModel() {
    const advancedJson = {};
    this.model.forEach((entry) => {
      if (
        entry?.key?.name &&
        entry?.value !== undefined &&
        entry?.value !== null
      ) {
        advancedJson[entry.key.name] = `${entry.value}`;
      }
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
    this.trackDashboard('advanced_config::add_new_config');
    this.model[$index].added = true;
    this.model.push({});
    this.getAddableProperties();
  }

  onRemoveConfig($index) {
    this.trackDashboard('advanced_config::delete_config');
    this.model.splice($index, 1);
    this.getAddableProperties();
  }

  onTypeChanged(modelValue, $index) {
    this.model[$index].key = null;
    // reset value on field change to avoid invalid data
    this.model[$index].value = undefined;
    this.$timeout(() => {
      this.model[$index].key = modelValue;
    });
  }

  updateAdvancedConfiguration() {
    this.trackDashboard('advanced_config::save_config');
    this.pending = true;
    this.CucCloudMessage.flushMessages(this.messageContainer);
    this.DatabaseService.editAdvancedConfiguration(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.getAdvancedConfigModel(),
    )
      .then((advancedConfiguration) => {
        this.trackDashboard('advanced_config::new_config_validated', 'page');
        this.advancedConfiguration = advancedConfiguration;
        this.model = this.initModelFromAdvancedConfig();
        this.addEmptyEntry();
        this.CucCloudMessage.success(
          {
            textHtml: this.$translate.instant(
              'pci_databases_advanced_configuration_update_success_message',
            ),
          },
          this.messageContainer,
        );
      })
      .catch((err) => {
        this.trackDashboard('advanced_config::new_config_error', 'page');
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_databases_advanced_configuration_update_error_message',
            {
              message: err.data?.message || null,
            },
          ),
          this.messageContainer,
        );
      })
      .finally(() => {
        this.pending = false;
      });
  }
}
