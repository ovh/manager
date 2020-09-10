export default class {
  /* @ngInject */
  constructor($translate, DedicatedCloud) {
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
  }

  enableUser() {
    return this.DedicatedCloud.enableUser(this.productId, this.user.userId)
      .then(() => {
        this.goBack(this.$translate('dedicatedCloud_USER_enable_success'));
      })
      .catch((err) => {
        this.goBack(
          `${this.$translate.instant('dedicatedCloud_USER_enable_fail', {
            t0: this.user.name,
          })} ${err.message || err}`,
          'danger',
        );
      });
  }
}
