import find from 'lodash/find';
import filter from 'lodash/filter';
import get from 'lodash/get';
import head from 'lodash/head';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import round from 'lodash/round';
import some from 'lodash/some';
import uniq from 'lodash/uniq';
import 'moment';

import BlockStorage from './block.class';
import Region from './region.class';

import {
  VOLUME_ADDON_FAMILY,
  VOLUME_MAX_SIZE,
  VOLUME_MIN_SIZE,
  VOLUME_SNAPSHOT_CONSUMPTION,
  VOLUME_UNLIMITED_QUOTA,
} from './block.constants';

export default class PciProjectStorageBlockService {
  /* @ngInject */
  constructor(
    $http,
    $q,
    CucPriceHelper,
    OvhApiCloudProject,
    OvhApiCloudProjectQuota,
    OvhApiCloudProjectVolumeSnapshot,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.CucPriceHelper = CucPriceHelper;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.OvhApiCloudProjectQuota = OvhApiCloudProjectQuota;
    this.OvhApiCloudProjectVolumeSnapshot = OvhApiCloudProjectVolumeSnapshot;
  }

  getAll(projectId) {
    let volumes;
    return this.OvhApiCloudProject.Volume()
      .v6()
      .query({
        serviceName: projectId,
      })
      .$promise.then((results) => {
        volumes = [...results];

        const instanceIds = uniq(
          reduce(
            volumes,
            (instanceAcc, volume) => {
              if (
                isArray(volume.attachedTo) &&
                !isEmpty(head(volume.attachedTo))
              ) {
                return [...instanceAcc, ...volume.attachedTo];
              }
              return [...instanceAcc];
            },
            [],
          ),
        );

        return this.$q.all(
          map(
            instanceIds,
            (instanceId) =>
              this.OvhApiCloudProject.Instance()
                .v6()
                .get({
                  serviceName: projectId,
                  instanceId,
                }).$promise,
          ),
        );
      })
      .then((instances) =>
        map(
          volumes,
          (volume) =>
            new BlockStorage({
              ...volume,
              attachedTo: map(volume.attachedTo, (instanceId) =>
                find(instances, { id: instanceId }),
              ),
            }),
        ),
      );
  }

  get(projectId, storageId) {
    return this.OvhApiCloudProject.Volume()
      .v6()
      .get({
        serviceName: projectId,
        volumeId: storageId,
      })
      .$promise.then((volume) =>
        this.$q.all({
          volume,
          instances: this.$q.all(
            map(
              volume.attachedTo,
              (instanceId) =>
                this.OvhApiCloudProject.Instance()
                  .v6()
                  .get({
                    serviceName: projectId,
                    instanceId,
                  }).$promise,
            ),
          ),
        }),
      )
      .then(({ instances, volume }) =>
        this.$q.all({
          volume,
          attachedTo: map(volume.attachedTo, (instanceId) =>
            find(instances, { id: instanceId }),
          ),
          snapshots: this.getVolumeSnapshots(projectId, volume),
        }),
      )
      .then(
        ({ attachedTo, volume, snapshots }) =>
          new BlockStorage({
            ...volume,
            attachedTo,
            snapshots,
          }),
      );
  }

  attachTo(projectId, storage, instance) {
    return this.OvhApiCloudProject.Volume()
      .v6()
      .attach(
        {
          serviceName: projectId,
          volumeId: storage.id,
        },
        {
          instanceId: instance.id,
        },
      ).$promise;
  }

  detach(projectId, storage) {
    return this.OvhApiCloudProject.Volume()
      .v6()
      .detach(
        {
          serviceName: projectId,
          volumeId: storage.id,
        },
        {
          instanceId: storage.attachedTo[0].id,
        },
      ).$promise;
  }

  getCompatiblesInstances(projectId, { region }) {
    return this.OvhApiCloudProject.Instance()
      .v6()
      .query({
        serviceName: projectId,
        region,
      }).$promise;
  }

  getVolumeSnapshots(projectId, { id }) {
    return this.OvhApiCloudProjectVolumeSnapshot.v6()
      .query({
        serviceName: projectId,
      })
      .$promise.then((snapshots) =>
        filter(snapshots, (snapshot) => snapshot.volumeId === id),
      );
  }

  getAvailableQuota(projectId, { region }) {
    return this.getProjectQuota(projectId, region).then((quota) => {
      if (quota && quota.volume) {
        let availableGigabytes = VOLUME_MAX_SIZE;
        if (quota.volume.maxGigabytes !== VOLUME_UNLIMITED_QUOTA) {
          availableGigabytes = Math.min(
            VOLUME_MAX_SIZE,
            quota.volume.maxGigabytes - quota.volume.usedGigabytes,
          );
        }
        return availableGigabytes;
      }
      return VOLUME_MAX_SIZE;
    });
  }

  getProjectQuota(projectId, region = null) {
    return this.OvhApiCloudProjectQuota.v6()
      .query({
        serviceName: projectId,
      })
      .$promise.then((results) => {
        if (region) {
          return find(results, { region });
        }
        return results;
      });
  }

  add(
    projectId,
    { description, imageId, name, region, size, snapshotId, type },
  ) {
    return this.OvhApiCloudProject.Volume()
      .v6()
      .save(
        {
          serviceName: projectId,
        },
        {
          description,
          imageId,
          name,
          region: region.name,
          size,
          snapshotId,
          type,
        },
      ).$promise;
  }

  update(projectId, { name, bootable, size }, originalStorage) {
    const promises = {};
    if (
      originalStorage.name !== name ||
      originalStorage.bootable !== bootable
    ) {
      promises.put = this.OvhApiCloudProject.Volume()
        .v6()
        .put(
          {
            serviceName: projectId,
            volumeId: originalStorage.id,
          },
          {
            name,
            bootable,
          },
        ).$promise;
    }
    if (size !== originalStorage.size) {
      promises.upsize = this.OvhApiCloudProject.Volume()
        .v6()
        .upsize(
          {
            serviceName: projectId,
            volumeId: originalStorage.id,
          },
          {
            size,
          },
        ).$promise;
    }
    return this.$q.all(promises);
  }

  delete(projectId, { id }) {
    return this.OvhApiCloudProject.Volume()
      .v6()
      .delete({
        serviceName: projectId,
        volumeId: id,
      }).$promise;
  }

  getCatalog(endpoint, ovhSubsidiary) {
    return this.$http
      .get(endpoint, {
        params: {
          ovhSubsidiary,
        },
      })
      .then(({ data }) => data);
  }

  static getVolumePriceEstimationFromCatalog(catalog, storage) {
    const relatedCatalog = get(
      catalog,
      storage.planCode,
      get(
        catalog,
        `volume.${storage.type}.consumption.${storage.region}`,
        get(catalog, `volume.${storage.type}.consumption`),
      ),
    );

    if (relatedCatalog) {
      const pricesEstimation = {
        hourly: (storage.size * relatedCatalog.priceInUcents) / 100000000,
      };
      pricesEstimation.monthly =
        pricesEstimation.hourly * moment.duration(1, 'months').asHours();

      return reduce(
        pricesEstimation,
        (result, value, key) => ({
          ...result,
          [key]: {
            currencyCode: relatedCatalog.price.currencyCode,
            text: relatedCatalog.price.text.replace(
              /\d+(?:[.,]\d+)?/,
              `${value.toFixed(2)}`,
            ),
            value,
          },
        }),
        {},
      );
    }

    return {
      price: {},
      monthlyPrice: {},
    };
  }

  getVolumePriceEstimation(projectId, storage, catalogEndpoint) {
    return this.CucPriceHelper.getPrices(
      projectId,
      catalogEndpoint,
    ).then((catalog) =>
      PciProjectStorageBlockService.getVolumePriceEstimationFromCatalog(
        catalog,
        storage,
        catalogEndpoint,
      ),
    );
  }

  static getRegionPricesByVolumeType(regions, catalog, type, size) {
    return reduce(
      regions,
      (regionResult, region) => ({
        ...regionResult,
        [region.name]: PciProjectStorageBlockService.getVolumePriceEstimationFromCatalog(
          catalog,
          { region, type, size },
        ),
      }),
      {},
    );
  }

  static getPricesEstimations(
    catalog,
    regions,
    size = VOLUME_MIN_SIZE,
    volumeTypes,
  ) {
    return reduce(
      volumeTypes,
      (typeResult, type) => {
        return {
          ...typeResult,
          [type]: PciProjectStorageBlockService.getRegionPricesByVolumeType(
            regions,
            catalog,
            type,
            size,
          ),
        };
      },
      {},
    );
  }

  getAvailablesRegions(projectId) {
    return this.OvhApiCloudProject.Region()
      .v6()
      .query({
        serviceName: projectId,
      })
      .$promise.then((regions) =>
        this.$q.all(
          map(
            regions,
            (region) =>
              this.OvhApiCloudProject.Region()
                .v6()
                .get({
                  serviceName: projectId,
                  id: region,
                }).$promise,
          ),
        ),
      )
      .then((regions) =>
        this.$q.all({
          quotas: this.getProjectQuota(projectId),
          regions,
        }),
      )
      .then(({ quotas, regions }) => {
        const supportedRegions = filter(regions, (region) =>
          some(get(region, 'services', []), { name: 'volume', status: 'UP' }),
        );
        return map(
          supportedRegions,
          (region) =>
            new Region({
              ...region,
              quota: find(quotas, { region: region.name }),
            }),
        );
      });
  }

  getVolumesAvailability(serviceName, params) {
    return this.$http
      .get(`/cloud/project/${serviceName}/capabilities/productAvailability`, {
        params,
      })
      .then(({ data }) => data);
  }

  getConsumptionVolumesAddons(catalog) {
    // Get volumes addons ids
    const volumeAddonsIds = catalog.plans
      .find((plan) => plan.planCode === 'project')
      .addonFamilies.find(({ name }) => name === VOLUME_ADDON_FAMILY).addons;

    // Get volumes addons details
    const consumptionVolumeAddons = catalog.addons.filter(
      (addon) =>
        volumeAddonsIds.includes(addon.planCode) &&
        addon.planCode.endsWith('consumption'),
    );

    return this.$q.when(consumptionVolumeAddons);
  }

  getSnapshotPriceEstimation(projectId, storage, catalogEndpoint) {
    return this.CucPriceHelper.getPrices(projectId, catalogEndpoint).then(
      (catalog) => {
        const price = get(
          catalog,
          `${VOLUME_SNAPSHOT_CONSUMPTION}.${storage.region}`,
          get(catalog, VOLUME_SNAPSHOT_CONSUMPTION, false),
        );
        if (price) {
          const snapshotPrice =
            (price.priceInUcents * moment.duration(1, 'months').asHours()) /
            100000000;
          return {
            price: snapshotPrice,
            priceText: price.price.text.replace(
              /\d+(?:[.,]\d+)?/,
              round(snapshotPrice.toString(), 2),
            ),
          };
        }
        return Promise.reject();
      },
    );
  }

  createSnapshot(projectId, { id }, { name }) {
    return this.OvhApiCloudProjectVolumeSnapshot.v6().create(
      {
        serviceName: projectId,
        volumeId: id,
      },
      {
        name,
      },
    ).$promise;
  }
}
