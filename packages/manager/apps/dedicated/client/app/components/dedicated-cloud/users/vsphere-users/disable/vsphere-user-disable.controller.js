export default class {
  /* @ngInject */
  constructor($scope, $translate, DedicatedCloud) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
  }

  disableUser() {
    return this.DedicatedCloud.disableUser(this.productId, this.user.userId)
      .then(() => {
        this.goBack(
          this.$translate.instant('dedicatedCloud_USER_disable_success', {
            t0: this.user.name,
          }),
        );
      })
      .catch((err) => {
        this.goBack(
          `${this.$translate.instant('dedicatedCloud_USER_disable_fail', {
            t0: this.user.name,
          })} ${err.message || err}`,
        );
      });
  }
}
