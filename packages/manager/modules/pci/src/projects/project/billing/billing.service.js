import assignIn from 'lodash/assignIn';
import clone from 'lodash/clone';
import filter from 'lodash/filter';
import flatten from 'lodash/flatten';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import reject from 'lodash/reject';
import set from 'lodash/set';

export default class CloudProjectBillingService {
  /* @ngInject */
  constructor($q, OvhApiMe) {
    this.$q = $q;
    this.OvhApiMe = OvhApiMe;
  }

  static roundNumber(number, decimals) {
    return Number(`${Math.round(`${number}e${decimals}`)}e-${decimals}`);
  }

  initHourlyInstanceList() {
    if (!get(this.data, 'hourlyBilling.hourlyUsage')) {
      return;
    }
    const hourlyInstances = flatten(
      map(get(this.data, 'hourlyBilling.hourlyUsage.instance'), (instance) =>
        map(instance.details, (detail) => {
          const newDetail = clone(detail);
          newDetail.totalPrice = this.constructor.roundNumber(
            newDetail.totalPrice,
            2,
          );
          return assignIn(newDetail, {
            reference: instance.reference,
            region: instance.region,
          });
        }),
      ),
    );
    this.data.hourlyInstances = hourlyInstances;
    this.data.totals.hourly.instance = reduce(
      get(this.data, 'hourlyBilling.hourlyUsage.instance'),
      (sum, instance) =>
        sum + this.constructor.roundNumber(instance.totalPrice, 2),
      0,
    );
    this.data.totals.hourly.instance = this.constructor.roundNumber(
      get(this.data, 'totals.hourly.instance'),
      2,
    );
  }

  initMonthlyInstanceList() {
    if (!get(this.data, 'monthlyBilling.monthlyUsage')) {
      return;
    }

    const monthlyInstances = flatten(
      map(get(this.data, 'monthlyBilling.monthlyUsage.instance'), (instance) =>
        map(instance.details, (detail) => {
          const newDetail = clone(detail);
          newDetail.totalPrice = this.constructor.roundNumber(
            newDetail.totalPrice,
            2,
          );
          return assignIn(newDetail, {
            reference: instance.reference,
            region: instance.region,
          });
        }),
      ),
    );

    this.data.monthlyInstances = monthlyInstances;
    this.data.totals.monthly.instance = reduce(
      this.data.monthlyBilling.monthlyUsage.instance,
      (sum, instance) =>
        sum + this.constructor.roundNumber(instance.totalPrice, 2),
      0,
    );
    this.data.totals.monthly.instance = this.constructor.roundNumber(
      this.data.totals.monthly.instance,
      2,
    );
  }

  initObjectStorageList() {
    if (!get(this.data, 'hourlyBilling.hourlyUsage')) {
      return;
    }
    forEach(
      this.data.hourlyBilling.hourlyUsage.objectStorage,
      (objectStorage) => {
        set(
          objectStorage,
          'totalPrice',
          this.constructor.roundNumber(objectStorage.totalPrice, 2),
        );
      },
    );

    this.data.objectStorages = reject(
      this.data.hourlyBilling.hourlyUsage.storage,
      { type: 'pca' },
    );
    this.data.totals.hourly.objectStorage = reduce(
      this.data.objectStorages,
      (sum, storage) =>
        sum + this.constructor.roundNumber(storage.totalPrice, 2),
      0,
    );
    this.data.totals.hourly.objectStorage = this.constructor.roundNumber(
      this.data.totals.hourly.objectStorage,
      2,
    );
  }

  initArchiveStorageList() {
    if (!get(this.data, 'hourlyBilling.hourlyUsage')) {
      return;
    }
    forEach(
      this.data.hourlyBilling.hourlyUsage.archiveStorage,
      (archiveStorage) => {
        set(
          archiveStorage,
          'totalPrice',
          this.constructor.roundNumber(archiveStorage.totalPrice, 2),
        );
      },
    );

    this.data.archiveStorages = filter(
      this.data.hourlyBilling.hourlyUsage.storage,
      { type: 'pca' },
    );
    this.data.totals.hourly.archiveStorage = reduce(
      this.data.archiveStorages,
      (sum, archiveStorage) =>
        sum + this.constructor.roundNumber(archiveStorage.totalPrice, 2),
      0,
    );
    this.data.totals.hourly.archiveStorage = this.constructor.roundNumber(
      this.data.totals.hourly.archiveStorage,
      2,
    );
  }

  initSnapshotList() {
    if (!get(this.data, 'hourlyBilling.hourlyUsage')) {
      return;
    }
    forEach(this.data.hourlyBilling.hourlyUsage.snapshot, (snapshot) => {
      set(
        snapshot,
        'totalPrice',
        this.constructor.roundNumber(snapshot.totalPrice, 2),
      );
    });

    this.data.snapshots = this.data.hourlyBilling.hourlyUsage.snapshot;
    this.data.totals.hourly.snapshot = reduce(
      this.data.hourlyBilling.hourlyUsage.snapshot,
      (sum, snapshot) =>
        sum + this.constructor.roundNumber(snapshot.totalPrice, 2),
      0,
    );
    this.data.totals.hourly.snapshot = this.constructor.roundNumber(
      this.data.totals.hourly.snapshot,
      2,
    );
  }

  initVolumeList() {
    if (!get(this.data, 'hourlyBilling.hourlyUsage')) {
      return;
    }
    const volumes = flatten(
      map(this.data.hourlyBilling.hourlyUsage.volume, (volume) =>
        map(volume.details, (detail) => {
          const newDetail = clone(detail);
          newDetail.totalPrice = this.constructor.roundNumber(
            newDetail.totalPrice,
            2,
          );
          return assignIn(newDetail, {
            type: volume.type,
            region: volume.region,
          });
        }),
      ),
    );

    this.data.volumes = volumes;
    this.data.totals.hourly.volume = reduce(
      this.data.hourlyBilling.hourlyUsage.volume,
      (sum, volume) => sum + this.constructor.roundNumber(volume.totalPrice, 2),
      0,
    );
    this.data.totals.hourly.volume = this.constructor.roundNumber(
      this.data.totals.hourly.volume,
      2,
    );
  }

  initInstanceBandwidth() {
    if (!get(this.data, 'hourlyBilling.hourlyUsage')) {
      return;
    }
    const bandwidthByRegions = map(
      this.data.hourlyBilling.hourlyUsage.instanceBandwidth,
      (bandwidthByRegion) => {
        const newBandwidthByRegion = clone(bandwidthByRegion);
        newBandwidthByRegion.outgoingBandwidth.totalPrice = this.constructor.roundNumber(
          newBandwidthByRegion.outgoingBandwidth.totalPrice,
          2,
        );
        if (newBandwidthByRegion.outgoingBandwidth.quantity.value > 0) {
          newBandwidthByRegion.outgoingBandwidth.quantity.value = this.constructor.roundNumber(
            newBandwidthByRegion.outgoingBandwidth.quantity.value,
            2,
          );
        }
        return newBandwidthByRegion;
      },
    );
    this.data.bandwidthByRegions = bandwidthByRegions;
    this.data.totals.hourly.bandwidth = reduce(
      this.data.bandwidthByRegions,
      (sum, bandwidth) => sum + bandwidth.outgoingBandwidth.totalPrice,
      0,
    );
    this.data.totals.hourly.bandwidth = this.constructor.roundNumber(
      this.data.totals.hourly.bandwidth,
      2,
    );
  }

  initResourceUsage(resourceType, resourceName) {
    const resources = flatten(
      map(
        filter(this.data.hourlyBilling.resourcesUsage, {
          type: resourceType,
        }),
        'resources',
      ),
    );

    this.data[resourceName] = flatten(
      map(resources, (resource) => {
        return map(resource.components, (resourceComponent) => {
          const component = resourceComponent;
          component.region = resource.region;
          return component;
        });
      }),
    );

    this.data.totals.hourly[resourceName] = this.data[resourceName].reduce(
      (total, component) => total + component.totalPrice,
      0,
    );

    this.data.totals.hourly[resourceName] = this.constructor.roundNumber(
      this.data.totals.hourly[resourceName] || 0,
      2,
    );
  }

  initPrivateRegistry() {
    this.initResourceUsage('registry', 'privateRegistry');
  }

  initLoadBalancer() {
    this.initResourceUsage('loadbalancer', 'loadBalancer');
  }

  getConsumptionDetails(hourlyBillingInfo, monthlyBillingInfo) {
    return this.getDataInitialized().then(() => {
      this.data.hourlyBilling = hourlyBillingInfo;
      this.data.monthlyBilling = monthlyBillingInfo;

      return this.$q
        .allSettled([
          this.initHourlyInstanceList(),
          this.initMonthlyInstanceList(),
          this.initObjectStorageList(),
          this.initArchiveStorageList(),
          this.initSnapshotList(),
          this.initVolumeList(),
          this.initInstanceBandwidth(),
          this.initPrivateRegistry(),
          this.initLoadBalancer(),
        ])
        .then(() => {
          this.data.totals.monthly.total = this.constructor.roundNumber(
            this.data.totals.monthly.instance,
            2,
          );
          this.data.totals.hourly.total = this.constructor.roundNumber(
            this.data.totals.hourly.instance +
              this.data.totals.hourly.snapshot +
              this.data.totals.hourly.objectStorage +
              this.data.totals.hourly.archiveStorage +
              this.data.totals.hourly.volume +
              this.data.totals.hourly.bandwidth +
              this.data.totals.hourly.privateRegistry +
              this.data.totals.hourly.loadBalancer,
            2,
          );
          this.data.totals.total = this.constructor.roundNumber(
            this.data.totals.monthly.total + this.data.totals.hourly.total,
            2,
          );
          return this.data;
        });
    });
  }

  getDataInitialized() {
    this.data = {
      hourlyInstances: [],
      monthlyInstances: [],
      objectStorages: [],
      archiveStorages: [],
      snapshots: [],
      volumes: [],
      bandwidthByRegions: [],
      billing: {},
      totals: {
        total: 0,
        currencySymbol: '',
        hourly: {
          total: 0,
          instance: 0,
          objectStorage: 0,
          archiveStorage: 0,
          snapshot: 0,
          volume: 0,
          bandwidth: 0,
        },
        monthly: {
          total: 0,
          instance: 0,
        },
      },
    };
    return this.OvhApiMe.v6()
      .get()
      .$promise.then((me) => {
        this.data.totals.currencySymbol = me.currency.symbol;
        return this.data;
      });
  }
}
