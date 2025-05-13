import angular from 'angular';

export default class MicrosoftOfficeLicenseUserDeleteCtrl {
  /* @ngInject */
  constructor(
    Alerter,
    MicrosoftOfficeLicenseService,
    $rootScope,
    $scope,
    $translate,
  ) {
    this.alerter = Alerter;
    this.license = MicrosoftOfficeLicenseService;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$translate = $translate;
  }

  $onInit() {
    this.user = angular.copy(this.$scope.currentActionData.user);

    this.loaders = {
      deleting: false,
    };

    this.$scope.deleteUser = () => {
      this.loaders.deleting = true;

      this.license
        .deleteUser(this.user.serviceName, this.user.activationEmail)
        .then(() =>
          this.alerter.success(
            this.$translate.instant(
              'microsoft_office_license_detail_user_delete_success',
            ),
            this.$scope.alerts.main,
          ),
        )
        .catch((err) =>
          this.alerter.alertFromSWS(
            this.$translate.instant(
              'microsoft_office_license_detail_user_delete_error',
            ),
            err,
            this.$scope.alerts.main,
          ),
        )
        .finally(() => {
          this.loaders.deleting = false;
          this.$rootScope.$broadcast('microsoft.office.license.user.delete');
          this.$scope.resetAction();
        });
    };
  }
}
