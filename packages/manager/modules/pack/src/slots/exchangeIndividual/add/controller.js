import angular from 'angular';
import forEach from 'lodash/forEach';
import get from 'lodash/get';


export default class {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $stateParams,
    $translate,
    OvhApiPackXdslExchangeIndividual,
    TucToast,
    tucValidator,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.OvhApiPackXdslExchangeIndividual = OvhApiPackXdslExchangeIndividual;
    this.TucToast = TucToast;
    this.tucValidator = tucValidator;
  }

  add() {
    this.pendingOrder = true;

    this.TucToast.info(this.$translate.instant('in_validation'));

    const accountTmp = angular.copy(this.account);
    delete accountTmp.name;
    delete accountTmp.domain;
    delete accountTmp.passwordConfirmation;

    accountTmp.email = this.account.name + this.account.domain;

    return this.OvhApiPackXdslExchangeIndividual
      .v6()
      .save({
        packId: this.$stateParams.packName,
      },
      this.accountTmp)
      .$promise
      .then((data) => {
        this.TucToast.success(this.$translate.instant('success_validation'));
        return data;
      })
      .catch((error) => {
        this.TucToast.error([this.$translate.instant('an_error_ocurred'), get(error, 'data.message', '')].join(' '));
        return this.$q.reject(error);
      })
      .finally(() => {
        this.pendingOrder = true;
      });
  }

  $onInit() {
    this.$scope.domains = [];

    this.OvhApiPackXdslExchangeIndividual
      .v6()
      .getDomains({ packId: this.$stateParams.packName }, (domains) => {
        forEach(domains, (domain) => {
          this.$scope.domains.push(`@${domain}`);
        });
      });

    this.$scope.$watchGroup([
      'ctrl.account.name',
      'ctrl.account.domain',
    ], (newValue) => {
      if (newValue[0] && newValue[1]) {
        const validAddress = this.tucValidator.isEmail(newValue[0] + newValue[1]);

        if (!validAddress) {
          this.$scope.accountForm.accountName.$error.invalidAddress = true;
        } else {
          delete this.$scope.accountForm.accountName.$error.invalidAddress;
        }

        this.$scope.accountForm.accountName.$validate();
      }
    });

    this.availablesDomains = [
      {
        value: '@ovh.fr',
        label: 'ovh.fr',
      },
    ];
  }
}
