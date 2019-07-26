import map from 'lodash/map';

export default class MicrosoftOfficeLicenseUserOrderCtrl {
  /* @ngInject */
  constructor(Alerter, MicrosoftOfficeLicenseService, $rootScope, $scope, OvhHttp) {
    this.alerter = Alerter;
    this.licenseService = MicrosoftOfficeLicenseService;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.OvhHttp = OvhHttp;
  }

  $onInit() {
    this.loaders = {
      licenseEnum: false,
      userOrder: false,
    };

    this.licenseId = this.$scope.currentActionData.license;
    this.license = null;
    this.numberOfLicenses = 1;

    this.$scope.orderUser = () => this.orderUser();

    this.getLicenses(this.licenseId);
  }

  orderUser() {
    this.loaders.userOrder = true;
    this.licenseService.gotToOrderPrepaidLicenses(
      this.licenseId,
      this.license,
      this.numberOfLicenses,
    );
    this.$scope.resetAction();
  }

  getLicenses(serviceName) {
    this.loaders.licenseEnum = true;

    return this.licenseService.getAvailableOptions(serviceName)
      .then((licenses) => {
        this.licenseEnum = map(licenses, 'planCode');
      }).finally(() => {
        this.loaders.licenseEnum = false;
      });
  }
}
