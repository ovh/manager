import find from 'lodash/find';
import { FORM_RULES, POLICIES, DEFAULT_VALUES } from './add-edit.constants';

export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
    this.FORM_RULES = FORM_RULES;
    this.POLICIES = POLICIES;
  }

  $onInit() {
    if (this.isUpdate) {
      this.trackDashboard('replication_flows::modify_replication_flow', 'page');
    } else {
      this.trackDashboard('replication_flows::create', 'page');
    }
    this.invalidTargetSource = false;
    this.model = {
      id: this.isUpdate ? this.replication.id : null,
      sourceIntegration: this.isUpdate
        ? find(this.readyServiceIntegrationList, {
            id: this.replication.sourceIntegration,
          })
        : null,
      targetIntegration: this.isUpdate
        ? find(this.readyServiceIntegrationList, {
            id: this.replication.targetIntegration,
          })
        : null,
      topics: this.isUpdate ? this.replication.topics : [],
      topicExcludeList: this.isUpdate ? this.replication.topicExcludeList : [],
      syncGroupOffsets: this.isUpdate
        ? this.replication.syncGroupOffsets
        : DEFAULT_VALUES.syncGroupOffset,
      syncInterval: this.isUpdate
        ? this.replication.syncInterval
        : DEFAULT_VALUES.editSyncInterval,
      replicationPolicyClass: this.isUpdate
        ? this.replication.replicationPolicyClass
        : null,
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
      this.model.targetIntegration &&
      this.model.sourceIntegration &&
      this.model.targetIntegration.id === this.model.sourceIntegration.id;
  }

  prepareModel() {
    return {
      id: this.model.id,
      sourceService: this.model.sourceService.id,
      targetService: this.model.targetService.id,
      topics: this.model.topics,
      topicExcludeList: this.model.topicExcludeList,
      syncInterval: this.model.syncInterval,
      syncGroupOffsets: this.model.syncGroupOffsets,
      heartbeatsEmit: this.model.heartbeatsEmit,
      replicationPolicyClass: this.model.replicationPolicyClass,
      enabled: this.model.enabled,
    };
  }

  addOrEditReplication() {
    this.processing = true;
    if (this.isUpdate) {
      this.trackDashboard(
        'replication_flows::actions_menu::modify_replication_flow_confirm',
      );
      return this.DatabaseService.updateReplication(
        this.projectId,
        this.database.engine,
        this.database.id,
        this.prepareModel(),
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
      this.prepareModel(),
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
