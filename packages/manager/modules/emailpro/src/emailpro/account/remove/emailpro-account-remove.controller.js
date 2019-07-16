angular
  .module('Module.emailpro.controllers')
  .controller('EmailProRemoveAccountCtrl', class ExchangeAddAccountCtrl {
    constructor($scope, $stateParams, $translate, EmailPro) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.EmailPro = EmailPro;
    }

    $onInit() {
      this.account = this.$scope.currentActionData;
      this.$scope.removeAccount = () => this.removeAccount();
    }

    removeAccount() {
      return this.EmailPro
        .removeAccount(this.$stateParams.productId, this.account.primaryEmailAddress)
        .then(() => {
          this.$scope.setMessage(this.$translate.instant('emailpro_tab_account_reset_success'), { status: 'success' });
        })
        .catch((err) => {
          this.$scope.setMessage(this.$translate.instant('emailpro_tab_account_reset_failure'), err);
        })
        .finally(() => {
          this.$scope.resetAction();
        });
    }
  });
