import angular from 'angular';

export default class MicrosoftOfficeLicenseEditCtrl {
  /* @ngInject */
  constructor(
    Alerter,
    MicrosoftOfficeLicenseService,
    $rootScope,
    $scope,
    $translate,
  ) {
    this.alerter = Alerter;
    this.licenseService = MicrosoftOfficeLicenseService;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$translate = $translate;
  }

  $onInit() {
    this.tenant = angular.copy(this.$scope.currentActionData.tenant);
    this.license = this.$scope.currentActionData.license;
    this.loaders = {
      edit: false,
    };

    this.$scope.edit = () => {
      this.loaders.edit = true;

      return this.licenseService
        .edit(this.license, this.tenant)
        .then((tenant) => {
          this.alerter.success(
            this.$translate.instant('microsoft_office_license_edit_success'),
            this.$scope.alerts.main,
          );
          this.$rootScope.$broadcast('change.displayName', [
            this.license,
            this.tenant.displayName,
          ]);
          return tenant;
        })
        .catch((err) => {
          this.alerter.alertFromSWS(
            this.$translate.instant('microsoft_office_license_edit_error'),
            this.$scope.alerts.main,
          );
          return err;
        })
        .finally(() => {
          this.loaders.edit = false;
          this.$rootScope.$broadcast('microsoft.office.license.edit');
          this.$scope.resetAction();
        });
    };
  }
}
