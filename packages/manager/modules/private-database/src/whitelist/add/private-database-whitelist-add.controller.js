import get from 'lodash/get';

export default class PrivateDatabaseAddWhitelistCtrl {
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

    this.model = {
      ip: '',
      name: '',
      service: false,
      sftp: false,
    };

    this.$scope.addWhitelist = () => {
      this.whitelistService
        .createWhitelist(this.productId, this.model)
        .then(() => {
          this.alerter.success(
            this.$translate.instant(
              'privateDatabase_modale_whitelist_add_success',
            ),
            this.$scope.alerts.main,
          );
        })
        .catch((err) => {
          this.alerter.alertFromSWS(
            this.$translate.instant(
              'privateDatabase_modale_whitelist_add_fail',
            ),
            get(err, 'data', err),
            this.$scope.alerts.main,
          );
        })
        .finally(() => this.$scope.resetAction());
    };
  }

  isIpValid(ip) {
    return (
      this.validator.isValidIpv4Block(ip) || this.validator.isValidIpv4(ip)
    );
  }

  isWhitelistValid() {
    return (
      this.isIpValid(this.model.ip) && (this.model.service || this.model.sftp)
    );
  }
}
