export default class {
  /* @ngInject */
  constructor($state, $stateParams) {
    this.$state = $state;
    this.$stateParams = $stateParams;
  }

  remove() {
    return this.OvhApiCloud.Project()
      .Acl()
      .v6()
      .remove({
        serviceName: this.$stateParams.projectId,
        accountId: this.$stateParams.accountId,
      })
      .$promise.then(() => {
        this.CucCloudMessage.success(
          this.$translate.instant('cpb_rights_table_rights_remove_success'),
        );
      })
      .catch((err) => {
        this.CucCloudMessage.error(
          [
            this.$translate.instant('cpb_rights_remove_error'),
            (err.data && err.data.message) || '',
          ].join(' '),
        );
      })
      .finally(() => {
        this.cancel();
      });
  }

  cancel() {
    return this.$state.go('^');
  }
}
