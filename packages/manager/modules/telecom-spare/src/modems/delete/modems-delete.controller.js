export default class {
  /* @ngInject */
  constructor($translate, OvhApiXdsl) {
    this.$translate = $translate;
    this.OvhApiXdsl = OvhApiXdsl;
  }

  $onInit() {
    this.loading = false;
  }

  deleteSpare() {
    this.loading = true;
    return this.OvhApiXdsl.Spare().v6().deleteSpare({
      spare: this.spare,
    }).$promise
      .then(() => this.goBack(
        this.$translate.instant('xdsl_modem_delete_succeed'),
      ))
      .catch(err => this.goBack(
        this.$translate.instant('xdsl_modem_delete_failed', { error: err.data.message }),
        'error',
      ))
      .finally(() => {
        this.loading = false;
      });
  }
}
