export default class DnsFormController {
  /* @ngInject */
  constructor($scope) {
    this.$scope = $scope;
  }

  onFormRemove = (index) => {
    this.onRemove({ index });
  };
}
