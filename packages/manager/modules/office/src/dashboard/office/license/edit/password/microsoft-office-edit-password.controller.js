export default class MicrosoftOfficePasswordEditCtrl {
  /* @ngInject */
  constructor(
    Alerter,
    MicrosoftOfficeLicenseService,
    $q,
    $scope,
    $translate,
    WucUser,
  ) {
    this.alerter = Alerter;
    this.licenseService = MicrosoftOfficeLicenseService;
    this.$q = $q;
    this.$scope = $scope;
    this.$translate = $translate;
    this.userService = WucUser;
  }

  loadUserInfos() {
    this.loaders.infos = true;
    this.$q
      .all([
        this.userService.getUser(),
        this.licenseService.getServiceInfos(this.licenseId),
      ])
      .then((data) => {
        if (data[0].nichandle === data[1].contactAdmin) {
          this.model.notifyEmail = data[0].email;
          this.edit.value = true;
        } else {
          this.edit.value = false;
          this.model.notifyEmail = '';
        }
      })
      .catch((err) => this.alerter.error(err))
      .finally(() => {
        this.loaders.infos = false;
      });
  }

  $onInit() {
    this.licenseId = this.$scope.currentActionData.user.serviceName;

    this.pwdPattern = /(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*_\-+=|\\(){}[\]:;'<>,.?\d])/;
    this.user = this.$scope.currentActionData.user;
    this.loaders = {
      edit: false,
      infos: false,
    };
    this.edit = {};

    this.model = {
      shouldSendMail: true,
    };
    this.password = {};

    this.$scope.changePassword = () => {
      this.loaders.edit = true;
      if (!this.model.password) {
        this.model.shouldSendMail = true;
      }

      if (!this.edit.value) {
        this.model.notifyEmail = null;
      }

      return this.licenseService
        .editPassword(this.licenseId, this.user.activationEmail, this.model)
        .then(() =>
          this.alerter.success(
            this.$translate.instant(
              'microsoft_office_license_edit_password_success',
            ),
            this.$scope.alerts.main,
          ),
        )
        .catch((err) =>
          this.alerter.alertFromSWS(
            this.$translate.instant(
              'microsoft_office_license_edit_password_error',
            ),
            err,
            this.$scope.alerts.main,
          ),
        )
        .finally(() => {
          this.loaders.edit = false;
          this.$scope.resetAction();
        });
    };

    this.loadUserInfos();
  }
}
