export default class PrivateDatabaseUpdateWhitelistCtrl {
  /* @ngInject */
  constructor(
    Alerter,
    PrivateDatabaseWhitelistService,
    $rootScope,
    $scope,
    $stateParams,
    $translate,
    WucValidator,
  ) {
    this.alerter = Alerter;
    this.whitelistService = PrivateDatabaseWhitelistService;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.validator = WucValidator;
  }

  $onInit() {
    this.productId = this.$stateParams.productId;

    this.whitelistToUpdate = this.$scope.currentActionData;

    this.whitelistId = this.whitelistToUpdate.ip;

    this.model = {
      name: this.whitelistToUpdate.name,
      service: this.whitelistToUpdate.service,
      sftp: this.whitelistToUpdate.sftp,
    };

    this.$scope.updateWhitelist = () => {
      this.whitelistService
        .updateWhitelist(this.productId, this.whitelistId, this.model)
        .then(() =>
          this.alerter.success(
            this.$translate.instant(
              'privateDatabase_modale_whitelist_update_success',
            ),
            this.$scope.alerts.main,
          ),
        )
        .catch(() =>
          this.alerter.error(
            this.$translate.instant(
              'privateDatabase_modale_whitelist_update_fail',
            ),
            this.$scope.alerts.main,
          ),
        )
        .finally(() => this.$scope.resetAction());
    };
  }

  isWhitelistValid() {
    return this.model.service || this.model.sftp;
  }
}
