export default class {
  /* @ngInject */
  constructor($translate, OvhApiXdsl) {
    this.$translate = $translate;
    this.OvhApiXdsl = OvhApiXdsl;
  }

  $onInit() {
    this.isApplyAvailable = false;

    this.selectedDomain = '';

    this.loading = false;
    this.loading = true;
    this.retrieveCompatibleReplacement();
  }

  retrieveCompatibleReplacement() {
    return this.OvhApiXdsl.Spare().v6().queryCompatibleReplacement({
      spare: this.spare,
    }).$promise
      .then((result) => {
        this.isApplyAvailable = true;
        this.compatibleDomains = result;
      })
      .catch(() => {
        this.isApplyAvailable = false;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  replaceSpare() {
    this.loading = true;
    return this.OvhApiXdsl.Spare().v6().replaceSpare({
      spare: this.spare,
    }, {
      domain: this.domain,
    }).$promise
      .then(() => this.goBack(
        this.$translate.instant('xdsl_modem_replace_succeed'),
      ))
      .catch(err => this.goBack(
        this.$translate.instant('xdsl_modem_replace_failed', { error: err.data.message }),
        'error',
      ))
      .finally(() => {
        this.loading = false;
      });
  }
}
