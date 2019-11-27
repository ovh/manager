export default class {
  /* @ngInject */
  constructor($translate, OvhApiTelephony) {
    this.$translate = $translate;
    this.OvhApiTelephony = OvhApiTelephony;
    this.phoneIP = null;
    this.selectedDomain = '';
  }

  $onInit() {
    this.isApplyAvailable = false;

    this.loading = true;
    this.retrieveCompatibleReplacement();
  }

  retrieveCompatibleReplacement() {
    return this.OvhApiTelephony.Spare().v6().queryCompatibleReplacement({
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
    return this.OvhApiTelephony.Spare().v6().replaceSpare({
      spare: this.spare,
    }, {
      domain: this.selectedDomain,
      ip: this.phoneIP,
    }).$promise
      .then(() => this.goBack(
        this.$translate.instant('phones_replace_succeed'),
      ))
      .catch(() => this.goBack(
        this.$translate.instant('phones_replace_failed', { spare: this.spare }),
        'error',
      ))
      .finally(() => {
        this.loading = false;
      });
  }
}
