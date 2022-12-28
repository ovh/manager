import { FAILOVER_TRACKING_HIT } from './failover.constants';

export default class IpFailoverController {
  /* @ngInject */
  constructor($scope, atInternet) {
    this.$scope = $scope;
    this.atInternet = atInternet;
    this.unusedFilter = false;
  }

  toggleUnusedFilter() {
    this.unusedFilter = !this.unusedFilter;
    this.$scope.$broadcast('ips.table.params', {
      serviceName: this.unusedFilter ? 'null' : null,
    });
    this.atInternet.trackClick({
      type: 'action',
      name: [
        this.trackingData.filtersPrefix,
        this.unusedFilter
          ? FAILOVER_TRACKING_HIT.UNUSED_ON
          : FAILOVER_TRACKING_HIT.UNUSED_OFF,
      ].join('::'),
    });
  }
}
