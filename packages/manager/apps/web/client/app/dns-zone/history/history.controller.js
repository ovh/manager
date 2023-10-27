export default class DomainDnsZoneHistoryController {
  /* @ngInject */
  constructor($filter, $timeout, $translate, $window, $stateParams, $state) {
    this.$filter = $filter;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$stateParams = $stateParams;
    this.$state = $state;
  }

  goBack() {
    this.$state.go('app.zone.details.dashboard', this.$stateParams);
  }
}
