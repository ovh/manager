export default class MicrosoftOfficeLicenseUserAddCtrl {
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

    this.licenseId = this.$scope.currentActionData.license;
    $scope.getLicensePrice = () => this.getLicensePrice();
  }

  $onInit() {
    this.user = {
      domain: this.licenseId,
    };
    this.licenseEnum = [];
    this.licensePrice = {};
    this.loaders = {
      licensePrice: false,
      licenseEnum: false,
      userAdd: false,
    };
    this.conditions = this.licenseService.constructor.getLoginConditions();
    this.conditionsMessage = this.licenseService.getLoginConditionsMessage();

    this.$scope.addUser = () => {
      this.loaders.userAdd = true;

      return this.licenseService
        .addUser(this.licenseId, this.user)
        .then((task) => {
          this.alerter.success(
            this.$translate.instant(
              'microsoft_office_license_detail_user_add_success',
            ),
            this.$scope.alerts.main,
          );
          return task;
        })
        .catch((err) => {
          this.alerter.alertFromSWS(
            this.$translate.instant(
              'microsoft_office_license_detail_user_add_error',
            ),
            err,
            this.$scope.alerts.main,
          );
          return err;
        })
        .finally(() => {
          this.loaders.userAdd = false;
          this.$rootScope.$broadcast('microsoft.office.license.user.add');
          this.$scope.resetAction();
        });
    };

    this.getLicenses();
  }

  getLicensePrice() {
    this.loaders.licensePrice = true;
    this.licensePrice.errText = '';
    this.licenseService
      .getLicensePrice(this.user.licence)
      .then((licensePrice) => {
        this.licensePrice.text = licensePrice.text;
      })
      .catch(() => {
        this.licensePrice.errText = this.$translate.instant(
          'microsoft_office_license_add_user_license_price_error',
        );
      })
      .finally(() => {
        this.loaders.licensePrice = false;
      });
  }

  getLicenses() {
    this.loaders.licenseEnum = true;

    this.licenseService
      .getLicenses()
      .then((licenseEnum) => {
        this.licenseEnum = licenseEnum;
      })
      .catch(() => {
        this.licenseEnum = [];
      })
      .finally(() => {
        this.loaders.licenseEnum = false;
      });
  }
}
