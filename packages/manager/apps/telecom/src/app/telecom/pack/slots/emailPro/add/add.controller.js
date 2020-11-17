import get from 'lodash/get';
import map from 'lodash/map';

export default class PackEmailProAddCtrl {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $state,
    $stateParams,
    $translate,
    OvhApiPackXdsl,
    TucToast,
    tucValidator,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.OvhApiPackXdsl = OvhApiPackXdsl;
    this.TucToast = TucToast;
    this.validator = tucValidator;
  }

  $onInit() {
    this.availablesDomains = [];

    this.OvhApiPackXdsl.EmailPro()
      .v6()
      .getDomains({ packName: this.$stateParams.packName })
      .$promise.then((domains) => {
        this.availablesDomains = map(domains, (domain) => ({
          value: `@${domain}`,
          label: domain,
        }));
      });

    this.$scope.$watchGroup(
      ['ctrl.account.name', 'ctrl.account.domain'],
      ([name, domain]) => {
        if (name && domain) {
          const email = name + domain;
          const validAddress = this.validator.isEmail(email);

          if (!validAddress) {
            this.$scope.accountForm.accountName.$error.invalidAddress = true;
            return this.$scope.accountForm.accountName.$validate();
          }
          delete this.$scope.accountForm.accountName.$error.invalidAddress;

          return this.OvhApiPackXdsl.EmailPro()
            .v6()
            .isEmailAvailable({
              packName: this.$stateParams.packName,
              email,
            })
            .$promise.then((data) => {
              if (!data.available) {
                return this.$q.reject();
              }
              delete this.$scope.accountForm.accountName.$error.invalidAddress;
              return data;
            })
            .catch(() => {
              this.$scope.accountForm.accountName.$error.invalidAddress = true;
            })
            .finally(() => {
              this.$scope.accountForm.accountName.$validate();
            });
        }
        return false;
      },
    );
  }

  add() {
    this.pendindOrder = true;

    return this.OvhApiPackXdsl.EmailPro()
      .v6()
      .save(
        { packName: this.$stateParams.packName },
        {
          email: this.account.name + this.account.domain,
          password: this.account.password,
        },
      )
      .$promise.then(() =>
        this.$state.go('telecom.packs.pack', {
          packName: this.$stateParams.packName,
        }),
      )
      .then(() =>
        this.TucToast.success(this.$translate.instant('success_validation')),
      )
      .catch((error) => {
        this.TucToast.error(
          [
            this.$translate.instant('an_error_ocurred'),
            get(error, 'data.message', ''),
          ].join(' '),
        );
        return this.$q.reject(error);
      })
      .finally(() => {
        this.pendingOrder = false;
      });
  }
}
