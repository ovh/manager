export default class {
  /* @ngInject */
  constructor($translate, OvhApiTelephony) {
    this.$translate = $translate;
    this.OvhApiTelephony = OvhApiTelephony;

    this.phoneIP = null;

    this.selectedDomain = '';
  }

  $onInit() {
    this.loading = false;
    this.title = 'phones_delete_title';
  }

  deleteSpare() {
    this.loading = true;
    return this.OvhApiTelephony.Spare().v6().deleteSpare({
      spare: this.spare,
    }).$promise
      .then(() => this.goBack(
        this.$translate.instant('phones_delete_succeed'),
      ))
      .catch(err => this.goBack(
        this.$translate.instant('phones_delete_failed', { error: err.data.message }),
        'error',
      ))
      .finally(() => {
        this.loading = false;
      });
  }
}
