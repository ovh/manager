angular.module('managerApp')
  .service('CloudProjectBillingService', function ($q, OvhApiMe) {
    const self = this;

    function roundNumber(number, decimals) {
      return Number((`${Math.round(`${number}e${decimals}`)}e-${decimals}`));
    }

    function initHourlyInstanceList() {
      if (!_.get(self.data, 'hourlyBilling') || !_.get(self.data, 'hourlyBilling.hourlyUsage')) {
        return;
      }
      const hourlyInstances = _.flatten(_.map(
        _.get(self.data, 'hourlyBilling.hourlyUsage.instance'),
        instance => _.map(instance.details, (detail) => {
          const newDetail = _.clone(detail);
          newDetail.totalPrice = roundNumber(newDetail.totalPrice, 2);
          return _.extend(newDetail, { reference: instance.reference, region: instance.region });
        }),
      ));
      self.data.hourlyInstances = hourlyInstances;
      self.data.totals.hourly.instance = _.reduce(
        _.get(self.data, 'hourlyBilling.hourlyUsage.instance'),
        (sum, instance) => sum + roundNumber(instance.totalPrice, 2), 0,
      );
      self.data.totals.hourly.instance = roundNumber(_.get(self.data, 'totals.hourly.instance'), 2);
    }

    function initMonthlyInstanceList() {
      if (!_.get(self.data, 'monthlyBilling') || !_.get(self.data, 'monthlyBilling.monthlyUsage')) {
        return;
      }

      const monthlyInstances = _.flatten(_.map(
        _.get(self.data, 'monthlyBilling.monthlyUsage.instance'),
        instance => _.map(instance.details, (detail) => {
          const newDetail = _.clone(detail);
          newDetail.totalPrice = roundNumber(newDetail.totalPrice, 2);
          return _.extend(newDetail, { reference: instance.reference, region: instance.region });
        }),
      ));

      self.data.monthlyInstances = monthlyInstances;
      self.data.totals.monthly.instance = _.reduce(
        self.data.monthlyBilling.monthlyUsage.instance,
        (sum, instance) => sum + roundNumber(instance.totalPrice, 2),
        0,
      );
      self.data.totals.monthly.instance = roundNumber(self.data.totals.monthly.instance, 2);
    }

    function initHourlyAdditionalServiceList() {
      if (!_.get(self.data, 'hourlyBilling') || !_.get(self.data, 'hourlyBilling.hourlyUsage')) {
        return;
      }
      const additionalServices = _.flatten(_.map(
        _.get(self.data, 'hourlyBilling.hourlyUsage.instanceOption'),
        instance => _.map(instance.details, (detail) => {
          const newDetail = _.clone(detail);
          newDetail.totalPrice = roundNumber(newDetail.totalPrice, 2);
          return _.extend(newDetail, {
            reference: instance.reference,
            region: instance.region,
            shortReference: _.last(instance.reference.split('.')),
          });
        }),
      ));
      self.data.hourlyAdditionalServices = _.groupBy(additionalServices, 'shortReference');
      self.data.totals.hourly.additionalServices = _.reduce(
        _.get(self.data, 'hourlyBilling.hourlyUsage.instanceOption'),
        (sum, instance) => sum + roundNumber(instance.totalPrice, 2), 0,
      );
      self.data.totals.hourly.additionalServices = roundNumber(_.get(self.data, 'totals.hourly.additionalServices'), 2);
    }

    function initMonthlyAdditionalServiceList() {
      if (!_.get(self.data, 'monthlyBilling') || !_.get(self.data, 'monthlyBilling.monthlyUsage')) {
        return;
      }
      const additionalServices = _.flatten(_.map(
        _.get(self.data, 'monthlyBilling.monthlyUsage.instanceOption'),
        instance => _.map(instance.details, (detail) => {
          const newDetail = _.clone(detail);
          newDetail.totalPrice = roundNumber(newDetail.totalPrice, 2);
          return _.extend(newDetail, {
            reference: instance.reference,
            region: instance.region,
            shortReference: _.last(instance.reference.split('.')),
          });
        }),
      ));
      self.data.monthlyAdditionalServices = _.groupBy(additionalServices, 'shortReference');
      self.data.totals.monthly.additionalServices = _.reduce(
        _.get(self.data, 'monthlyBilling.monthlyUsage.instanceOption'),
        (sum, instance) => sum + roundNumber(instance.totalPrice, 2), 0,
      );
      self.data.totals.monthly.additionalServices = roundNumber(_.get(self.data, 'totals.monthly.additionalServices'), 2);
    }

    function initObjectStorageList() {
      if (!self.data.hourlyBilling || !self.data.hourlyBilling.hourlyUsage) {
        return;
      }
      _.each(self.data.hourlyBilling.hourlyUsage.objectStorage, (objectStorage) => {
        _.set(objectStorage, 'totalPrice', roundNumber(objectStorage.totalPrice, 2));
      });

      self.data.objectStorages = _.reject(self.data.hourlyBilling.hourlyUsage.storage, { type: 'pca' });
      self.data.totals.hourly.objectStorage = _.reduce(
        self.data.objectStorages,
        (sum, storage) => sum + roundNumber(storage.totalPrice, 2),
        0,
      );
      self.data.totals.hourly.objectStorage = roundNumber(self.data.totals.hourly.objectStorage, 2);
    }

    function initArchiveStorageList() {
      if (!self.data.hourlyBilling || !self.data.hourlyBilling.hourlyUsage) {
        return;
      }
      _.each(self.data.hourlyBilling.hourlyUsage.archiveStorage, (archiveStorage) => {
        _.set(archiveStorage, 'totalPrice', roundNumber(archiveStorage.totalPrice, 2));
      });

      self.data.archiveStorages = _.filter(self.data.hourlyBilling.hourlyUsage.storage, { type: 'pca' });
      self.data.totals.hourly.archiveStorage = _.reduce(
        self.data.archiveStorages,
        (sum, archiveStorage) => sum + roundNumber(archiveStorage.totalPrice, 2),
        0,
      );
      self.data.totals.hourly.archiveStorage = roundNumber(
        self.data.totals.hourly.archiveStorage,
        2,
      );
    }

    function initSnapshotList() {
      if (!self.data.hourlyBilling || !self.data.hourlyBilling.hourlyUsage) {
        return;
      }
      _.each(self.data.hourlyBilling.hourlyUsage.snapshot, (snapshot) => {
        _.set(snapshot, 'totalPrice', roundNumber(snapshot.totalPrice, 2));
      });

      self.data.snapshots = self.data.hourlyBilling.hourlyUsage.snapshot;
      self.data.totals.hourly.snapshot = _.reduce(
        self.data.hourlyBilling.hourlyUsage.snapshot,
        (sum, snapshot) => sum + roundNumber(snapshot.totalPrice, 2),
        0,
      );
      self.data.totals.hourly.snapshot = roundNumber(self.data.totals.hourly.snapshot, 2);
    }

    function initVolumeList() {
      if (!self.data.hourlyBilling || !self.data.hourlyBilling.hourlyUsage) {
        return;
      }
      const volumes = _.flatten(_.map(
        self.data.hourlyBilling.hourlyUsage.volume,
        volume => _.map(volume.details, (detail) => {
          const newDetail = _.clone(detail);
          newDetail.totalPrice = roundNumber(newDetail.totalPrice, 2);
          return _.extend(newDetail, { type: volume.type, region: volume.region });
        }),
      ));

      self.data.volumes = volumes;
      self.data.totals.hourly.volume = _.reduce(
        self.data.hourlyBilling.hourlyUsage.volume,
        (sum, volume) => sum + roundNumber(volume.totalPrice, 2),
        0,
      );
      self.data.totals.hourly.volume = roundNumber(self.data.totals.hourly.volume, 2);
    }

    function initInstanceBandwidth() {
      if (!self.data.hourlyBilling || !self.data.hourlyBilling.hourlyUsage) {
        return;
      }
      const bandwidthByRegions = _.map(
        self.data.hourlyBilling.hourlyUsage.instanceBandwidth,
        (bandwidthByRegion) => {
          const newBandwidthByRegion = _.clone(bandwidthByRegion);
          newBandwidthByRegion.outgoingBandwidth.totalPrice = roundNumber(
            newBandwidthByRegion.outgoingBandwidth.totalPrice,
            2,
          );
          if (newBandwidthByRegion.outgoingBandwidth.quantity.value > 0) {
            newBandwidthByRegion.outgoingBandwidth.quantity.value = roundNumber(
              newBandwidthByRegion.outgoingBandwidth.quantity.value,
              2,
            );
          }
          return newBandwidthByRegion;
        },
      );
      self.data.bandwidthByRegions = bandwidthByRegions;
      self.data.totals.hourly.bandwidth = _.reduce(
        self.data.bandwidthByRegions,
        (sum, bandwidth) => sum + bandwidth.outgoingBandwidth.totalPrice,
        0,
      );
      self.data.totals.hourly.bandwidth = roundNumber(self.data.totals.hourly.bandwidth, 2);
    }

    self.getConsumptionDetails = function (hourlyBillingInfo, monthlyBillingInfo) {
      return self.getDataInitialized()
        .then(() => {
          self.data.hourlyBilling = hourlyBillingInfo;
          self.data.monthlyBilling = monthlyBillingInfo;

          return $q
            .allSettled([
              initHourlyInstanceList(),
              initMonthlyInstanceList(),
              initHourlyAdditionalServiceList(),
              initMonthlyAdditionalServiceList(),
              initObjectStorageList(),
              initArchiveStorageList(),
              initSnapshotList(),
              initVolumeList(),
              initInstanceBandwidth(),
            ])
            .then(() => {
              self.data.totals.monthly.total = roundNumber(
                self.data.totals.monthly.instance
                + self.data.totals.monthly.additionalServices,
                2,
              );
              self.data.totals.hourly.total = roundNumber(
                self.data.totals.hourly.instance
                + self.data.totals.hourly.additionalServices
                + self.data.totals.hourly.snapshot
                + self.data.totals.hourly.objectStorage
                + self.data.totals.hourly.archiveStorage
                + self.data.totals.hourly.volume
                + self.data.totals.hourly.bandwidth,
                2,
              );
              self.data.totals.total = roundNumber(
                self.data.totals.monthly.total + self.data.totals.hourly.total,
                2,
              );
              return self.data;
            });
        });
    };

    self.getDataInitialized = function () {
      self.data = {
        hourlyInstances: [],
        monthlyInstances: [],
        hourlyAdditionalServices: [],
        monthlyAdditionalServices: [],
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
            additionalServices: 0,
            objectStorage: 0,
            archiveStorage: 0,
            snapshot: 0,
            volume: 0,
            bandwidth: 0,
          },
          monthly: {
            total: 0,
            instance: 0,
            additionalServices: 0,
          },
        },
      };
      return OvhApiMe.v6().get().$promise.then((me) => {
        self.data.totals.currencySymbol = me.currency.symbol;
        return self.data;
      });
    };
  });
