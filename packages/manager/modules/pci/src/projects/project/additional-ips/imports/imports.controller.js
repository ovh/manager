import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';
import map from 'lodash/map';

export default class AdditionalIpImportsController {
  /* @ngInject */
  constructor($q, OvhApiIp, projectId) {
    this.$q = $q;
    this.OvhApiIp = OvhApiIp;
    this.projectId = projectId;
    this.ips = null;

    this.loadData();
  }

  loadData() {
    return this.OvhApiIp.v6()
      .query({
        type: 'failover',
      })
      .$promise.then((ips) =>
        this.$q.all(
          map(
            ips,
            (ip) =>
              this.OvhApiIp.v6().get({
                ip,
              }).$promise,
          ),
        ),
      )
      .then((ips) =>
        filter(
          ips,
          ({ routedTo }) =>
            isEmpty(routedTo) ||
            (isObject(routedTo) && routedTo.serviceName !== this.projectId),
        ),
      )
      .then((ips) => {
        this.ips = ips;
      });
  }
}
