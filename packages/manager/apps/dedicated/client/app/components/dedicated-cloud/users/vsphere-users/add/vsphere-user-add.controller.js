import validator from 'validator';

import { TRACKING_PREFIX } from './vsphere-user-add.constant';

export default class {
  /* @ngInject */
  constructor($translate, DedicatedCloud) {
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
    this.boundAddUser = this.addUser.bind(this);
    this.boundOnCancel = this.onCancel.bind(this);
  }

  $onInit() {
    this.regCase = /[A-Z]/;

    this.canSetPassword = false;

    this.loaders = {
      init: true,
      add: false,
    };

    this.newUser = {
      name: null,
      errorCase: false,
      right: null,
    };

    this.showError = {
      checkPassword: false,
    };
  }

  addUser() {
    this.trackClick(`${TRACKING_PREFIX}::confirm`);
    this.loaders.add = true;
    this.DedicatedCloud.addUser(this.productId, this.newUser).then(
      () =>
        this.goBackWithTrackingPage({
          message: this.$translate.instant('dedicatedCloud_users_add_start'),
          trackingTag: `${TRACKING_PREFIX}-success`,
        }),
      (err) =>
        this.goBackWithTrackingPage({
          message: `${this.$translate.instant(
            'dedicatedCloud_users_add_error',
          )} ${err.message || err}`,
          type: 'danger',
          trackingTag: `${TRACKING_PREFIX}-error`,
        }),
    );
  }

  caseControl() {
    if (this.newUser.name === undefined) {
      this.newUser.errorCase = false;
    } else if (this.regCase.test(this.newUser.name)) {
      this.newUser.name = this.newUser.name.toLowerCase();
      this.newUser.errorCase = true;
    }
  }

  checkOptionsStates() {
    this.loaders.init = true;
    return this.DedicatedCloud.hasSecurityOption(this.productId)
      .then((hasSecurityOption) => {
        this.canSetPassword = !hasSecurityOption;
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
        this.loaders.init = false;
      });
  }

  static getClassLabel(label, noDirty) {
    if (label && (noDirty || label.$dirty)) {
      return (label.$invalid && 'has-error') || 'has-success';
    }
    return '';
  }

  static hasError(label) {
    return label.$invalid && label.$dirty;
  }

  checkPassword(password) {
    if (!password || password === '') {
      this.showError.checkPassword = false;
      return true;
    }

    this.newUser.password = password;

    const passwordIsCorrect = this.DedicatedCloud.constructor.checkPassword(
      this.passwordPolicy,
      { password },
    );
    this.showError.checkPassword = !passwordIsCorrect;

    return passwordIsCorrect;
  }

  static validEmail(value) {
    if (!value || value === '') {
      return true;
    }

    return validator.isEmail(value);
  }

  onCancel() {
    this.trackClick(`${TRACKING_PREFIX}::cancel`);
    return this.goBack();
  }
}
