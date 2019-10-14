import get from 'lodash/get';

export default class {
  constructor($timeout) {
    'ngInject';

    this.$timeout = $timeout;
  }

  outOfStock(cluster) {
    const count = get(cluster, ['hostCount', this.enterpriseDb.datacenter, 'hostLeft'], 0);
    return count < 3;
  }

  onClusterSelect(cluster) {
    this.enterpriseDb.cluster = cluster;
    if (this.onChange) {
      this.$timeout(() => this.onChange({
        cluster,
      }));
    }
  }
}
