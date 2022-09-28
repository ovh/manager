export default class IpFailoverController {
  constructor($scope) {
    this.$scope = $scope;
    this.unusedFilter = false;
  }

  toggleUnusedFilter() {
    this.unusedFilter = !this.unusedFilter;
    this.$scope.$broadcast('ips.table.params', {
      serviceName: this.unusedFilter ? 'null' : null,
    });
  }
}
