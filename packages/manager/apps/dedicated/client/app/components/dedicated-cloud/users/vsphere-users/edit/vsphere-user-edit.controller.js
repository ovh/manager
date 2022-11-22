import get from 'lodash/get';
import pick from 'lodash/pick';

export default class {
  /* @ngInject */
  constructor($translate, coreConfig, DedicatedCloud) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.DedicatedCloud = DedicatedCloud;
  }

  $onInit() {
    this.user.tokenValidator = this.user.isTokenValidator;
    this.emailRegExp = /^(?:[\w-.]+@[\w-.]+\.[\w-]+)?$/;
    if (this.coreConfig.isRegion('US')) {
      this.phoneRegExp = /\+1\.\d{10}/;
    } else {
      this.phoneRegExp = /\+\d{1,4}\.\d{5,15}/;
    }
    this.phoneExample = new RandExp(this.phoneRegExp).gen();
  }

  editUser() {
    this.loading = true;
    return this.DedicatedCloud.updateUser(
      this.productId,
      pick(this.user, [
        'userId',
        'name',
        'firstName',
        'lastName',
        'email',
        'phoneNumber',
        'tokenValidator',
        'canManageNetwork',
        'canManageIpFailOvers',
        'nsxRight',
        'encryptionRight',
      ]),
    )
      .then(() => {
        this.goBack(
          this.$translate.instant('dedicatedCloud_USER_edit_success'),
        );
      })
      .catch((err) => {
        this.goBack(
          `${this.$translate.instant('dedicatedCloud_USER_edit_error')} ${get(
            err,
            'message',
            err,
          )}`,
          'danger',
        );
      });
  }
}
