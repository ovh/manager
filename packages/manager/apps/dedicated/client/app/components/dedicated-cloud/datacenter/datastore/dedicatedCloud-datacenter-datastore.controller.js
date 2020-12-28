import get from 'lodash/get';
import set from 'lodash/set';

import {
  RESOURCE_BILLING_TYPES,
  RESOURCE_UPGRADE_TYPES,
} from '../../resource/upgrade/upgrade.constants';

import { DEDICATED_CLOUD_DATACENTER } from '../dedicatedCloud-datacenter.constants';

export default class {
  /* @ngInject */
  constructor(
    $q,
    DedicatedCloud,
    ovhManagerPccDatacenterService,
    ovhManagerPccDatacenterDatastoreService,
  ) {
    this.$q = $q;
    this.DedicatedCloud = DedicatedCloud;
    this.ovhManagerPccDatacenterService = ovhManagerPccDatacenterService;
    this.ovhManagerPccDatacenterDatastoreService = ovhManagerPccDatacenterDatastoreService;
    this.DEDICATED_CLOUD_DATACENTER = DEDICATED_CLOUD_DATACENTER;
  }

  $onInit() {
    this.RESOURCE_BILLING_TYPES = RESOURCE_BILLING_TYPES;
    this.RESOURCE_UPGRADE_TYPES = RESOURCE_UPGRADE_TYPES;

    this.noConsumptionResponse = new RegExp('no consumption', 'i');
  }

  fetchLegacyConsumption(datastores) {
    return this.$q.all(
      datastores.map((dc) => {
        if (dc.billing === this.RESOURCE_BILLING_TYPES.hourly) {
          return this.ovhManagerPccDatacenterDatastoreService
            .fetchLegacyHourlyConsumption(
              this.productId,
              this.datacenterId,
              dc.id,
            )
            .then((response) => {
              set(dc, 'consumption', get(response, 'consumption.value'));
              set(dc, 'consumptionLastUpdate', response.lastUpdate);
              return dc;
            })
            .catch((err) => {
              if (this.noConsumptionResponse.test(err.message)) {
                set(dc, 'consumption', 0);
              } else {
                set(dc, 'consumption', null);
              }

              return dc;
            });
        }

        return this.$q.when(dc);
      }),
    );
  }

  fetchConsumptionForDatastores(datastores) {
    return (serviceConsumption) =>
      this.$q.all(
        serviceConsumption
          ? datastores.map(
              this.fetchConsumptionForDatastore(serviceConsumption),
            )
          : datastores,
      );
  }

  fetchConsumptionForDatastore(serviceConsumption) {
    return (datastore) => {
      if (
        datastore.billing === this.RESOURCE_BILLING_TYPES.hourly &&
        datastore.status === 'DELIVERED'
      ) {
        const datastoreConsumption = this.ovhManagerPccDatacenterService.constructor.extractElementConsumption(
          serviceConsumption,
          {
            id: datastore.id,
            type: this.DEDICATED_CLOUD_DATACENTER.elementTypes.datastore,
          },
        );

        return {
          ...datastore,
          consumption: get(datastoreConsumption, 'quantity', 0),
          consumptionLastUpdate: serviceConsumption.lastUpdate,
        };
      }

      return datastore;
    };
  }

  chooseConsumptionFetchingMethod(datastores) {
    return !this.usesLegacyOrder
      ? this.ovhManagerPccDatacenterService
          .fetchConsumptionForService(this.serviceId)
          .then(this.fetchConsumptionForDatastores(datastores))
      : this.fetchLegacyConsumption(datastores);
  }

  loadDatastores({ offset, pageSize }) {
    return this.DedicatedCloud.getDatastores(
      this.productId,
      this.datacenterId,
      pageSize,
      offset - 1,
    ).then((result) =>
      this.chooseConsumptionFetchingMethod(result.list.results).then(
        (data) => ({
          data,
          meta: {
            totalCount: result.count,
          },
        }),
      ),
    );
  }
}
