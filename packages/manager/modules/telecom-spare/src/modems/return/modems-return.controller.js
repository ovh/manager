export default class {
  /* @ngInject */
  constructor($translate, OvhApiXdsl) {
    this.$translate = $translate;
    this.OvhApiXdsl = OvhApiXdsl;
  }

  $onInit() {
    this.loading = false;
    this.title = 'xdsl_modem_return_title';
  }

  returnMerchandise() {
    this.loading = true;
    return this.OvhApiXdsl.Spare().v6().returnMerchandise({
      spare: this.spare,
    }, {}).$promise
      .then(() => this.goBack(
        this.$translate.instant('xdsl_modem_return_succeed'),
      ))
      .catch(err => this.goBack(
        this.$translate.instant('xdsl_modem_return_failed', { error: err.data.message }),
        'error',
      ))
      .finally(() => {
        this.loading = false;
      });
  }
}
