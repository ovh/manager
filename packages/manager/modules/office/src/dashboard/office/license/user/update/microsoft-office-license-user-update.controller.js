import angular from 'angular';
import isEmpty from 'lodash/isEmpty';

export default class MicrosoftOfficeLicenseUserUpdateCtrl {
  /* @ngInject */
  constructor(
    Alerter,
    MicrosoftOfficeLicenseService,
    $rootScope,
    $scope,
    $translate,
  ) {
    this.alerter = Alerter;
    this.microsoftOfficeLicenseService = MicrosoftOfficeLicenseService;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$translate = $translate;
  }

  $onInit() {
    this.loaders = {
      userEdit: false,
    };

    this.conditions = this.microsoftOfficeLicenseService.constructor.getLoginConditions();
    this.conditionsMessage = this.microsoftOfficeLicenseService.getLoginConditionsMessage();
    this.user = angular.copy(this.$scope.currentActionData.user);

    if (!isEmpty(this.user.activationEmail)) {
      const activationEmailSplitted = this.user.activationEmail.split('@');

      this.user.login = activationEmailSplitted[0]; // eslint-disable-line
      this.user.service = activationEmailSplitted[1]; // eslint-disable-line
    }

    this.$scope.updateUser = () => {
      this.loaders.userEdit = true;
      this.microsoftOfficeLicenseService
        .updateUser(
          this.user.serviceName,
          this.$scope.currentActionData.user.activationEmail,
          {
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            activationEmail: `${this.user.login}@${this.user.service}`,
          },
        )
        .then((task) => {
          this.alerter.success(
            this.$translate.instant(
              'microsoft_office_license_detail_user_edit_success',
            ),
            this.$scope.alerts.main,
          );
          return task;
        })
        .catch((err) =>
          this.alerter.alertFromSWS(
            this.$translate.instant(
              'microsoft_office_license_detail_user_edit_error',
            ),
            err,
            this.$scope.alerts.main,
          ),
        )
        .finally(() => {
          this.loaders.userEdit = false;
          this.$rootScope.$broadcast('microsoft.office.license.user.edit');
          this.$scope.resetAction();
        });
    };
  }
}
