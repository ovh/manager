import get from 'lodash/get';
import includes from 'lodash/includes';

export default class {
  /* @ngInject */
  constructor($q, DedicatedCloud) {
    this.$q = $q;
    this.DedicatedCloud = DedicatedCloud;
  }

  getRight(order) {
    return this.dedicatedCloud
      ? !includes(this.dedicatedCloud.orderRight, order)
      : false;
  }

  loadDatacenters({ offset, pageSize }) {
    return this.DedicatedCloud.getDatacentersInformations(
      this.dedicatedCloud.serviceName,
      pageSize,
      offset - 1,
    )
      .then((result) => ({
        data: get(result, 'list.results'),
        meta: {
          totalCount: result.count,
        },
      }))
      .catch((err) => {
        this.setMessage(
          `${this.$translate.instant(
            'dedicatedCloud_datacenters_loading_error',
          )} ${err.message || ''}`,
          'danger',
        );
        return this.$q.reject(err);
      });
  }
}
