export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    // this.trackDashboard('users::add_a_user', 'page');
    this.model = {
      source: this.isUpdate ? this.replication.source : null,
      target: this.isUpdate ? this.replication.target : null,
      topics: this.isUpdate ? this.replication.topics : [],
      blacklistedTopics: this.isUpdate
        ? this.replication.blacklistedTopics
        : [],
      syncGroupOffset: this.isUpdate ? this.replication.syncGroupOffset : false,
      editSyncInterval: this.isUpdate ? this.replication.editSyncInterval : 60,
      policy: this.isUpdate ? this.replication.policy : null,
      heartbeat: this.isUpdate ? this.replication.heartbeat : true,
      status: this.isUpdate ? this.replication.status === 'enabled' : true,
    };
  }

  cancel() {
    // this.trackDashboard('users::add_a_user::cancel');
    this.goBack();
  }
}
