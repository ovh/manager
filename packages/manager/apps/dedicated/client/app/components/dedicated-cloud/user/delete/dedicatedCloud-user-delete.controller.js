export default class {
  /* @ngInject */
  constructor($translate, DedicatedCloud) {
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
  }

  deleteUser() {
    return this.DedicatedCloud.deleteUser(this.productId, this.user.userId)
      .then(() => {
        this.goBack(
          this.$translate.instant('dedicatedCloud_USER_delete_success', {
            t0: this.user.name,
          }),
        );
      })
      .catch((err) => {
        this.goBack(
          `${this.$translate.instant('dedicatedCloud_USER_delete_fail', {
            t0: this.user.name,
          })} ${err.message || err}`,
        );
      });
  }
}
