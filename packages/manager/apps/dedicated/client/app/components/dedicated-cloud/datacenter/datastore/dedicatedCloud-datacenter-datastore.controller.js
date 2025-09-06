import get from 'lodash/get';
import set from 'lodash/set';

import {
  RESOURCE_BILLING_TYPES,
  RESOURCE_UPGRADE_TYPES,
  RESOURCE_STATES,
} from '../../resource/upgrade/upgrade.constants';

import { DEDICATED_CLOUD_DATACENTER } from '../dedicatedCloud-datacenter.constants';
import { DEDICATED_CLOUD_DATASTORE_GUIDES } from './dedicatedCloud-datacenter-datastore.constants';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    ovhManagerPccDatacenterService,
    ovhManagerPccDatacenterDatastoreService,
    coreConfig,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.ovhManagerPccDatacenterService = ovhManagerPccDatacenterService;
    this.ovhManagerPccDatacenterDatastoreService = ovhManagerPccDatacenterDatastoreService;
    this.DEDICATED_CLOUD_DATACENTER = DEDICATED_CLOUD_DATACENTER;
    this.guides =
      DEDICATED_CLOUD_DATASTORE_GUIDES[coreConfig.getUser()?.ovhSubsidiary] ||
      DEDICATED_CLOUD_DATASTORE_GUIDES.DEFAULT;
  }

  $onInit() {
    this.RESOURCE_BILLING_TYPES = RESOURCE_BILLING_TYPES;
    this.RESOURCE_UPGRADE_TYPES = RESOURCE_UPGRADE_TYPES;
    this.RESOURCE_STATES = RESOURCE_STATES;

    this.noConsumptionResponse = new RegExp('no consumption', 'i');
    this.$serviceConsumption = this.ovhManagerPccDatacenterService.fetchConsumptionForService(
      this.serviceId,
    );
  }

  fetchLegacyConsumption(datastore) {
    if (datastore.billingType === this.RESOURCE_BILLING_TYPES.hourly) {
      return this.ovhManagerPccDatacenterDatastoreService
        .fetchLegacyHourlyConsumption(
          this.productId,
          this.datacenterId,
          datastore.filerId,
        )
        .then((response) => {
          set(datastore, 'consumption', get(response, 'consumption.value'));
          set(datastore, 'consumptionLastUpdate', response.lastUpdate);
        })
        .catch((err) => {
          if (this.noConsumptionResponse.test(err.message)) {
            set(datastore, 'consumption', 0);
          } else {
            set(datastore, 'consumption', null);
          }
        });
    }

    return this.$q.when(datastore);
  }

  fetchConsumptionForDatastore(datastore) {
    return (serviceConsumption) => {
      if (
        datastore.billingType === this.RESOURCE_BILLING_TYPES.hourly &&
        datastore.state === RESOURCE_STATES.delivered
      ) {
        const datastoreConsumption = this.ovhManagerPccDatacenterService.constructor.extractElementConsumption(
          serviceConsumption,
          {
            id: datastore.filerId,
            type: this.DEDICATED_CLOUD_DATACENTER.elementTypes.datastore,
          },
        );

        const consumption = get(datastoreConsumption, 'quantity', 0);
        set(datastore, 'consumption', consumption);
        set(datastore, 'consumptionLastUpdate', serviceConsumption.lastUpdate);
        return datastore;
      }

      return datastore;
    };
  }

  getDatastoreUsage(datastore) {
    const datastoreUnit = this.$translate.instant(
      `unit_size_${datastore.size.unit}`,
    );
    return `${datastore.spaceUsed} / ${datastore.size.value} ${datastoreUnit}`;
  }

  chooseConsumptionFetchingMethod(datastore) {
    return !this.usesLegacyOrder
      ? this.$serviceConsumption.then(
          this.fetchConsumptionForDatastore(datastore),
        )
      : this.fetchLegacyConsumption(datastore);
  }

  fetchLocation(datastore) {
    return this.ovhManagerPccDatacenterDatastoreService
      .getDatastoreLocation(this.productId, datastore.dc, datastore.filerId)
      .then((location) => {
        set(datastore, 'location', location);
      })
      .catch(() => null);
  }

  checkGlobalCompatibility(datastore) {
    return this.ovhManagerPccDatacenterDatastoreService
      .getDatastoreGlobalCompatibility(this.productId, datastore)
      .then(({ data }) => {
        set(datastore, 'isGlobalCompatible', data);
      });
  }

  loadDatastores({ offset, pageSize }) {
    return this.ovhManagerPccDatacenterDatastoreService
      .getDatastores(this.productId, this.datacenterId, pageSize, offset - 1)
      .then(({ data, count }) => {
        data.forEach((datastore) => {
          set(datastore, 'asyncLoading', true);
          this.$q
            .all([
              this.chooseConsumptionFetchingMethod(datastore),
              this.fetchLocation(datastore),
              this.checkGlobalCompatibility(datastore),
            ])
            .finally(() => {
              set(datastore, 'asyncLoading', false);
            });
        });
        return { data, meta: { totalCount: count } };
      });
  }
}
