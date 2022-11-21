export default class {
  /* @ngInject */
  constructor($translate, DedicatedCloud) {
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
  }

  $onInit() {
    this.canBeResetHere = false;
    this.resetUrl = '';
    this.password = '';
    this.user.confirmPassword = this.user.confirmPassword
      ? this.user.confirmPassword
      : '';
    this.showError = {
      checkPassword: false,
    };
    this.loading = false;
  }

  resetPassword() {
    this.isReseting = true;
    return this.DedicatedCloud.resetUserPassword(
      this.productId,
      this.user,
      this.user.password,
    )
      .then(() => {
        this.goBack(
          this.$translate.instant('dedicatedCloud_users_password_loading_done'),
          'success',
          false,
        );
      })
      .catch((err) => {
        this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_users_password_loading_error',
          )} ${err.message || err}`,
          'danger',
        );
      });
  }

  checkPassword(data) {
    this.user.password = data;
    this.showError.checkPassword = false;

    return this.DedicatedCloud.constructor.checkPassword(
      this.passwordPolicy,
      this.user,
    );
  }

  getSelectedProduct() {
    return this.DedicatedCloud.getDescription(this.productId).then(
      (productDescription) => {
        this.resetUrl = productDescription.vScopeUrl.replace(
          'vScope',
          'secure',
        );
      },
    );
  }

  checkOptionsStates() {
    this.loading = true;
    return this.DedicatedCloud.hasSecurityOption(this.productId)
      .then((hasSecurityOption) => {
        this.canBeResetHere = !hasSecurityOption;
        if (hasSecurityOption) {
          return this.getSelectedProduct();
        }
        return null;
      })
      .catch((err) => {
        this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_users_password_reset_check_error',
          )} ${err.message || err}`,
          'danger',
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
