import { FORM_RULES, DEFAULT_VALUES } from './add-edit.constants';

export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
    this.FORM_RULES = FORM_RULES;
  }

  $onInit() {
    // this.trackDashboard('users::add_a_user', 'page');
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
    // this.trackDashboard('users::add_a_user::cancel');
    this.goBack();
  }

  checkTargetAndSourceValidity() {
    this.invalidTargetSource =
      this.model.target &&
      this.model.source &&
      this.model.target.id === this.model.source.id;
  }

  addOrEditReplication() {
    this.model.submitted = true;
  }
}
