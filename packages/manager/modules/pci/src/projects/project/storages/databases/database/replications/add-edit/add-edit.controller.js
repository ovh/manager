import find from 'lodash/find';
import { FORM_RULES, DEFAULT_VALUES } from './add-edit.constants';

export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
    this.FORM_RULES = FORM_RULES;
  }

  $onInit() {
    if (this.isUpdate) {
      this.trackDashboard('replication_flows::modify_replication_flow', 'page');
    } else {
      this.trackDashboard('replication_flows::create', 'page');
    }
    this.invalidTargetSource = false;
    this.model = {
      sourceService: this.isUpdate
        ? find(this.serviceIntegrationList, {
            id: this.replication.sourceService,
          })
        : null,
      targetService: this.isUpdate
        ? find(this.serviceIntegrationList, {
            id: this.replication.targetService,
          })
        : null,
      topics: this.isUpdate ? this.replication.topics : [],
      topicExcludeList: this.isUpdate ? this.replication.topicExcludeList : [],
      syncGroupOffsets: this.isUpdate
        ? this.replication.syncGroupOffsets
        : DEFAULT_VALUES.status,
      syncInterval: this.isUpdate
        ? this.replication.syncInterval
        : DEFAULT_VALUES.editSyncInterval,
      policy: this.isUpdate ? this.replication.policy : null,
      heartbeatsEmit: this.isUpdate
        ? this.replication.heartbeatsEmit
        : DEFAULT_VALUES.heartbeat,
      enabled: this.isUpdate ? this.replication.enabled : DEFAULT_VALUES.status,
    };
  }

  cancel() {
    if (this.isUpdate) {
      this.trackDashboard(
        'replication_flows::actions_menu::modify_replication_flow_cancel',
      );
    } else {
      this.trackDashboard('replication_flows::create_replication_flow_cancel');
    }
    this.goBack();
  }

  checkTargetAndSourceValidity() {
    this.invalidTargetSource =
      this.model.targetService &&
      this.model.sourceService &&
      this.model.targetService.id === this.model.sourceService.id;
  }

  addOrEditReplication() {
    this.processing = true;
    if (this.isUpdate) {
      this.trackDashboard(
        'replication_flows::actions_menu::modify_replication_flow_confirm',
      );
      this.model.id = this.replication.id;
      return this.DatabaseService.updateReplication(
        this.projectId,
        this.database.engine,
        this.database.id,
        this.model,
      )
        .then(() =>
          this.goBack({
            textHtml: this.$translate.instant(
              'pci_databases_replications_edit_success_message',
            ),
          }),
        )
        .catch((err) =>
          this.goBack(
            this.$translate.instant(
              'pci_databases_replications_edit_error_message',
              {
                message: err.data?.message || null,
              },
            ),
            'error',
          ),
        );
    }
    this.trackDashboard('replication_flows::create_replication_flow_confirm');
    return this.DatabaseService.addReplication(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.model,
    )
      .then(() =>
        this.goBack({
          textHtml: this.$translate.instant(
            'pci_databases_replications_add_success_message',
          ),
        }),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_databases_replications_add_error_message',
            {
              message: err.data?.message || null,
            },
          ),
          'error',
        ),
      );
  }
}
