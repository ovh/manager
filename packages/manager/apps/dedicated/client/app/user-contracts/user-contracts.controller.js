import includes from 'lodash/includes';

export default class UserContractsCtrl {
  /* @ngInject */
  constructor($scope, $timeout, coreConfig, ContractService, User) {
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.coreConfig = coreConfig;
    this.ContractService = ContractService;
    this.User = User;
  }

  $onInit() {
    this.agreeTosAndPpOnManagerLoad = this.coreConfig.isRegion('US');

    if (this.agreeTosAndPpOnManagerLoad) {
      this.ContractService.getAgreementsToValidate((contract) =>
        includes(['tos', 'pp'], contract.code),
      ).then((contracts) => {
        if (contracts.length) {
          this.$scope.currentAction = 'modal/user-contracts-accept';
          this.$scope.stepPath =
            'user-contracts/modal/user-contracts-accept.html';
          $('#user-contracts-currentAction').modal({
            keyboard: false,
            backdrop: 'static',
          });
        }
      });
    }
  }
}
