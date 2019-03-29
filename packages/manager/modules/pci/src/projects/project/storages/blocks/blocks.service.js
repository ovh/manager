import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import uniq from 'lodash/uniq';

import moment from 'moment';

import BlockStorage from './block.class';

import {
  VOLUME_MAX_SIZE,
  VOLUME_MIN_SIZE,
  VOLUME_UNLIMITED_QUOTA,
  VOLUME_TYPES,
} from './constants';

export default class PciProjectStorageBlockService {
  /* @ngInject */
  constructor(
    $q,
    CucPriceHelper,
    OvhApiCloudProject,
    OvhApiCloudProjectQuota,
  ) {
    this.$q = $q;
    this.CucPriceHelper = CucPriceHelper;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.OvhApiCloudProjectQuota = OvhApiCloudProjectQuota;
  }

  getAll(projectId) {
    let volumes;
    return this.OvhApiCloudProject
      .Volume()
      .v6()
      .query({
        serviceName: projectId,
      })
      .$promise
      .then((results) => {
        volumes = [...results];

        const instanceIds = uniq(
          reduce(
            volumes,
            (instanceAcc, volume) => [
              ...instanceAcc,
              ...volume.attachedTo,
            ],
            [],
          ),
        );

        return this.$q.all(
          map(
            instanceIds,
            instanceId => this.OvhApiCloudProject
              .Instance()
              .v6()
              .get({
                serviceName: projectId,
                instanceId,
              })
              .$promise,
          ),
        );
      })
      .then(instances => map(
        volumes,
        volume => new BlockStorage({
          ...volume,
          attachedTo: map(
            volume.attachedTo,
            instanceId => find(instances, { id: instanceId }),
          ),
        }),
      ));
  }

  get(projectId, storageId) {
    let volume;
    return this.OvhApiCloudProject
      .Volume()
      .v6()
      .get({
        serviceName: projectId,
        volumeId: storageId,
      })
      .$promise
      .then((result) => {
        volume = result;
        return this.$q.all(
          map(
            volume.attachedTo,
            instanceId => this.OvhApiCloudProject
              .Instance()
              .v6()
              .get({
                serviceName: projectId,
                instanceId,
              })
              .$promise,
          ),
        );
      })
      .then((instances) => {
        volume.attachedTo = map(
          volume.attachedTo,
          instanceId => find(instances, { id: instanceId }),
        );
        return new BlockStorage(volume);
      });
  }

  attachTo(projectId, storage, instance) {
    return this.OvhApiCloudProject
      .Volume()
      .v6()
      .attach(
        {
          serviceName: projectId,
          volumeId: storage.id,
        }, {
          instanceId: instance.id,
        },
      )
      .$promise;
  }

  detach(projectId, storage) {
    return this.OvhApiCloudProject
      .Volume()
      .v6()
      .detach(
        {
          serviceName: projectId,
          volumeId: storage.id,
        },
        {
          instanceId: storage.attachedTo[0].id,
        },
      )
      .$promise;
  }

  getCompatiblesInstances(projectId, { region }) {
    return this.OvhApiCloudProject
      .Instance()
      .v6()
      .query({
        serviceName: projectId,
        region,
      })
      .$promise;
  }

  getAvailableQuota(projectId, storage) {
    return this.getProjectQuotaForRegion(projectId, storage.region)
      .then((quota) => {
        if (quota && quota.volume) {
          // this.hasEnoughQuota = true;
          let availableGigabytes = VOLUME_MAX_SIZE;
          if (quota.volume.maxGigabytes !== VOLUME_UNLIMITED_QUOTA) {
            availableGigabytes = Math.min(
              VOLUME_MAX_SIZE,
              quota.volume.maxGigabytes - quota.volume.usedGigabytes,
            );
            if (availableGigabytes < VOLUME_MIN_SIZE) {
              // this.hasEnoughQuota = false;
            }
          }
          return availableGigabytes;
        }
        return VOLUME_MAX_SIZE;
      });
  }

  getProjectQuotaForRegion(projectId, region) {
    return this.OvhApiCloudProjectQuota
      .v6()
      .query({
        serviceName: projectId,
      })
      .$promise
      .then(results => find(results, { region }));
  }

  add(
    projectId,
    {
      description,
      imageId,
      name,
      region,
      size,
      snapshotId,
      type,
    },
  ) {
    return this.OvhApiCloudProject
      .Volume()
      .v6()
      .save(
        {
          serviceName: projectId,
        },
        {
          description,
          imageId,
          name,
          region,
          size,
          snapshotId,
          type,
        },
      )
      .$promise;
  }

  update(projectId, { name, bootable, size }, originalStorage) {
    const promises = {};
    if (originalStorage.name !== name || originalStorage.bootable !== bootable) {
      promises.put = this.OvhApiCloudProject
        .Volume()
        .v6()
        .put({
          serviceName: projectId,
          volumeId: originalStorage.id,
        }, {
          name,
          bootable,
        })
        .$promise;
    }
    if (size !== originalStorage.size) {
      promises.upsize = this.OvhApiCloudProject
        .Volume()
        .v6()
        .upsize({
          serviceName: projectId,
          volumeId: originalStorage.id,
        }, {
          size,
        })
        .$promise;
    }
    return this.$q.all(promises);
  }

  getVolumePriceEstimation(projectId, storage) {
    return this.CucPriceHelper.getPrices(projectId)
      .then((fomattedCatalog) => {
        const catalog = get(
          fomattedCatalog,
          storage.planCode,
          get(
            fomattedCatalog,
            `volume.${storage.type}.consumption.${storage.region}`,
            get(
              fomattedCatalog,
              `volume.${storage.type}.consumption`,
            ),
          ),
        );

        if (catalog) {
          const pricesEstimation = {
            hourly: storage.size * catalog.priceInUcents / 100000000,
          };
          pricesEstimation.monthly = pricesEstimation.hourly * moment.duration(1, 'months').asHours();

          return reduce(
            pricesEstimation,
            (result, value, key) => ({
              ...result,
              [key]: {
                currencyCode: catalog.price.currencyCode,
                text: catalog.price.text.replace(/\d+(?:[.,]\d+)?/, `${value.toFixed(2)}`),
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
      });
  }

  getAvailablesRegions(projectId) {
    return this.OvhApiCloudProject
      .Region()
      .v6()
      .query({
        serviceName: projectId,
      })
      .$promise
      .then(regions => this.$q.all(
        map(
          regions,
          region => this.OvhApiCloudProject
            .Region()
            .v6()
            .get({
              serviceName: projectId,
              id: region,
            })
            .$promise,
        ),
      ));
  }

  getAvailablesTypes() {
    return this.$q.when(VOLUME_TYPES);
  }
}
