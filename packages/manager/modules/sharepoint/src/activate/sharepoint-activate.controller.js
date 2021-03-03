export default class SharepointActivateOfficeCtrl {
  /* @ngInject */
  constructor(
    Alerter,
    MicrosoftSharepointLicenseService,
    $stateParams,
    $scope,
    $translate,
    WucUser,
  ) {
    this.alerter = Alerter;
    this.sharepointService = MicrosoftSharepointLicenseService;
    this.$stateParams = $stateParams;
    this.$scope = $scope;
    this.$translate = $translate;
    this.userService = WucUser;
  }

  $onInit() {
    this.account = this.$scope.currentActionData;
    this.hasLicence = false;
    this.licenceOrderUrl = 'https://www.ovh.com/fr/office-365/'; // default value

    this.getUser();

    this.$scope.submit = () => {
      this.$scope.resetAction();
      return this.sharepointService
        .updateSharepointAccount(
          this.$stateParams.exchangeId,
          this.account.userPrincipalName,
          {
            officeLicense: true,
          },
        )
        .then(() => {
          this.alerter.success(
            this.$translate.instant(
              'sharepoint_action_activate_office_licence_success_message',
              { t0: this.account.userPrincipalName },
            ),
            this.$scope.alerts.main,
          );
        })
        .catch((err) =>
          this.alerter.alertFromSWS(
            this.$translate.instant(
              'sharepoint__action_activate_office_licence_error_message',
            ),
            err,
            this.$scope.alerts.main,
          ),
        )
        .finally(() => this.$scope.resetAction());
    };
  }

  getUser() {
    return this.userService
      .getUser()
      .then((user) => {
        this.licenceOrderUrl = `https://www.ovh.com/${user.ovhSubsidiary.toLowerCase()}/office-365`;
      })
      .catch(() =>
        this.alerter.alertFromSWS(
          this.$translate.instant(
            'sharepoint_accounts_action_sharepoint_add_error_message',
          ),
        ),
      );
  }
}
