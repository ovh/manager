import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, coreConfig, DedicatedCloud) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.DedicatedCloud = DedicatedCloud;
  }

  $onInit() {
    this.user.tokenValidator = this.user.isTokenValidator;
    this.originUser = this.pickUserInformationToSend();
    this.emailRegExp = /^(?:[\w-.]+@[\w-.]+\.[\w-]+)?$/;
    if (this.coreConfig.isRegion('US')) {
      this.phoneRegExp = /\+1\.\d{10}/;
    } else {
      this.phoneRegExp = /\+\d{1,4}\.\d{5,15}/;
    }
    this.phoneExample = new RandExp(this.phoneRegExp).gen();
  }

  pickUserInformationToSend() {
    if (this.user === null) return null;
    const {
      userId,
      name,
      firstName,
      lastName,
      email,
      phoneNumber,
      tokenValidator,
      canManageNetwork,
      canManageIpFailOvers,
      nsxRight,
      encryptionRight,
    } = this.user;

    return {
      userId,
      name,
      firstName,
      lastName,
      email,
      phoneNumber,
      tokenValidator,
      canManageNetwork,
      canManageIpFailOvers,
      nsxRight,
      encryptionRight,
    };
  }

  editUser() {
    this.loading = true;
    return this.DedicatedCloud.updateUser(
      this.productId,
      this.pickUserInformationToSend(),
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

  isEdited() {
    return !angular.equals(this.pickUserInformationToSend(), this.originUser);
  }
}
