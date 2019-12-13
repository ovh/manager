import forEach from 'lodash/forEach';
import keys from 'lodash/keys';
import map from 'lodash/map';
import pick from 'lodash/pick';

export default class IpLoadBalancerHomeStatusService {
  /* @ngInject */
  constructor($q, $translate, OvhApiIpLoadBalancing, CucServiceHelper) {
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiIpLoadBalancing = OvhApiIpLoadBalancing;
    this.CucServiceHelper = CucServiceHelper;

    this.apiToUiStatus = {
      ok: 'success',
      unknown: 'help',
      warn: 'warning',
      error: 'error',
    };

    this.iplbItemWeight = {
      service: 1,
      frontends: 2,
      farms: 3,
      servers: 4,
    };
  }

  getIPLBStatus(serviceName, config = { toArray: false }) {
    return this.OvhApiIpLoadBalancing.v6().status({ serviceName })
      .$promise
      .then((response) => {
        const transformedResponse = {};
        const promises = map(
          keys(pick(response, keys(this.iplbItemWeight))),
          (iplbItem) => {
            response[iplbItem].itemName = iplbItem;
            return this.transformIplbItem(serviceName, response[iplbItem]).then((item) => {
              transformedResponse[iplbItem] = item;
            });
          },
        );

        return this.$q.all(promises)
          .then(() => {
            if (config.toArray) {
              return map(keys(transformedResponse), iplbItem => transformedResponse[iplbItem]);
            }
            return transformedResponse;
          });
      })
      .catch(this.CucServiceHelper.errorHandler('iplb_status_loading_error'));
  }

  transformIplbItem(serviceName, iplbItem) {
    switch (iplbItem.itemName) {
      case 'service':
        return this.buildServiceStatusItem(serviceName, iplbItem);
      default:
        return this.buildOtherStatusItem(iplbItem);
    }
  }

  buildServiceStatusItem(serviceName, iplbItem) {
    return this.OvhApiIpLoadBalancing.v6().get({ serviceName })
      .$promise
      .then(response => ({
        itemName: iplbItem.itemName,
        displayName: response.displayName || response.serviceName,
        status: {
          [this.apiToUiStatus[iplbItem.status]]: {
            code: this.apiToUiStatus[iplbItem.status],
            number: 1,
            text: this.$translate.instant(`iplb_status_${this.apiToUiStatus[iplbItem.status]}_${iplbItem.itemName}`),
          },
        },
        total: 1,
        weight: this.iplbItemWeight[iplbItem.itemName],
      }));
  }

  buildOtherStatusItem(iplbItem) {
    const transformedItem = {
      itemName: iplbItem.itemName,
      displayName: this.$translate.instant(`iplb_home_tile_status_${iplbItem.itemName}`, { number: iplbItem.total }),
      status: {},
      total: iplbItem.total,
      weight: this.iplbItemWeight[iplbItem],
    };

    forEach(keys(iplbItem.status), (status) => {
      transformedItem.status[this.apiToUiStatus[status]] = {
        code: this.apiToUiStatus[status],
        number: iplbItem.status[status],
        text: this.$translate.instant(`iplb_status_${this.apiToUiStatus[status]}_${iplbItem.itemName}`, {
          activeCount: iplbItem.status[status],
          totalCount: iplbItem.total,
        }),
      };
    });
    return this.$q.when(transformedItem);
  }
}
