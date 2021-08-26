export default class PrivateDatabaseDeleteWhitelistCtrl {
  /* @ngInject */
  constructor(
    Alerter,
    PrivateDatabaseWhitelistService,
    $rootScope,
    $scope,
    $stateParams,
    $translate,
  ) {
    this.alerter = Alerter;
    this.whitelistService = PrivateDatabaseWhitelistService;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
  }

  $onInit() {
    this.productId = this.$stateParams.productId;

    this.whitelistToDelete = this.$scope.currentActionData;

    this.$scope.deleteWhitelist = () => {
      this.whitelistService
        .deleteWhitelist(this.productId, this.whitelistToDelete.ip)
        .then(() => {
          this.alerter.success(
            this.$translate.instant(
              'privateDatabase_modale_whitelist_delete_success',
            ),
            this.$scope.alerts.main,
          );
        })
        .catch(() => {
          this.alerter.error(
            this.$translate.instant(
              'privateDatabase_modale_whitelist_delete_fail',
            ),
            this.$scope.alerts.main,
          );
        })
        .finally(() => this.$scope.resetAction());
    };
  }
}
