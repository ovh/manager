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
      source: this.isUpdate ? this.replication.source : null,
      target: this.isUpdate ? this.replication.target : null,
      topics: this.isUpdate ? this.replication.topics : [],
      blacklistedTopics: this.isUpdate
        ? this.replication.blacklistedTopics
        : [],
      syncGroupOffset: this.isUpdate
        ? this.replication.syncGroupOffset
        : DEFAULT_VALUES.status,
      editSyncInterval: this.isUpdate
        ? this.replication.editSyncInterval
        : DEFAULT_VALUES.editSyncInterval,
      policy: this.isUpdate ? this.replication.policy : null,
      heartbeat: this.isUpdate
        ? this.replication.heartbeat
        : DEFAULT_VALUES.heartbeat,
      status: this.isUpdate
        ? this.replication.status === 'enabled'
        : DEFAULT_VALUES.status,
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
      this.model.target &&
      this.model.source &&
      this.model.target.id === this.model.source.id;
  }

  addOrEditReplication() {
    if (this.isUpdate) {
      this.trackDashboard(
        'replication_flows::actions_menu::modify_replication_flow_confirm',
      );
    } else {
      this.trackDashboard('replication_flows::create_replication_flow_confirm');
    }
    this.model.submitted = true;
  }
}
