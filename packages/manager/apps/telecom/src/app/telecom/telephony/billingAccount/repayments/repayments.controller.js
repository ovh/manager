export default class TelecomTelephonyRepaymentsCtrl {
  /* @ngInject  */
  constructor($timeout) {
    this.$timeout = $timeout;
  }

  $onInit() {
    this.load();
  }

  async load() {
    this.loading = true;
    this.$timeout(() => {
      this.loading = false;
    }, 2000);
  }
}
