import get from 'lodash/get';
import includes from 'lodash/includes';
import filter from 'lodash/filter';
import map from 'lodash/map';
import round from 'lodash/round';
import moment from 'moment';

import Instance from './instance.class';

import {
  INSTANCE_BACKUP_CONSUMPTION,
} from './instances.constants';

export default class PciProjectInstanceService {
  /* @ngInject */
  constructor(
    $q,
    CucPriceHelper,
    OvhApiCloudProjectFlavor,
    OvhApiCloudProjectImage,
    OvhApiCloudProjectInstance,
    OvhApiCloudProjectVolume,
  ) {
    this.$q = $q;
    this.CucPriceHelper = CucPriceHelper;
    this.OvhApiCloudProjectFlavor = OvhApiCloudProjectFlavor;
    this.OvhApiCloudProjectImage = OvhApiCloudProjectImage;
    this.OvhApiCloudProjectInstance = OvhApiCloudProjectInstance;
    this.OvhApiCloudProjectVolume = OvhApiCloudProjectVolume;
  }

  getAll(projectId) {
    return this.OvhApiCloudProjectInstance
      .v6()
      .query({
        serviceName: projectId,
      })
      .$promise
      .then(instances => map(instances, instance => new Instance(instance)));
  }

  getInstanceDetails(projectId, instance) {
    return this.$q
      .all({
        image: this.OvhApiCloudProjectImage
          .v6()
          .get({
            serviceName: projectId,
            imageId: instance.imageId,
          })
          .$promise
          .catch(() => null),
        flavor: this.OvhApiCloudProjectFlavor
          .v6()
          .get({
            serviceName: projectId,
            flavorId: instance.flavorId,
          })
          .$promise
          .catch(() => null),
        volumes: this.OvhApiCloudProjectVolume
          .v6()
          .query({
            serviceName: projectId,
          })
          .$promise
          .catch(() => []),
      })
      .then(({ image, flavor, volumes }) => new Instance({
        ...instance,
        image,
        flavor,
        volumes: filter(volumes, volume => includes(volume.attachedTo, instance.id)),
      }));
  }

  get(projectId, instanceId) {
    return this.OvhApiCloudProjectInstance
      .v6()
      .get({
        serviceName: projectId,
        instanceId,
      })
      .$promise
      .then(instance => this.$q.all({
        instance,
        volumes: this.OvhApiCloudProjectVolume
          .v6()
          .query({
            serviceName: projectId,
          })
          .$promise
          .catch(() => []),
      }))
      .then(({ instance, volumes }) => new Instance({
        ...instance,
        volumes: filter(volumes, volume => includes(volume.attachedTo, instance.id)),
      }));
  }

  delete(projectId, { id: instanceId }) {
    return this.OvhApiCloudProjectInstance
      .v6()
      .delete({
        serviceName: projectId,
        instanceId,
      })
      .$promise;
  }

  reinstall(projectId, { id: instanceId, image }) {
    return this.OvhApiCloudProjectInstance
      .v6()
      .reinstall({
        serviceName: projectId,
        instanceId,
      }, {
        imageId: image.id,
      })
      .$promise;
  }

  reboot(projectId, { id: instanceId }, type) {
    return this.OvhApiCloudProjectInstance
      .v6()
      .reboot({
        serviceName: projectId,
        instanceId,
      }, {
        type,
      })
      .$promise;
  }

  getCompatibleRescueImages(projectId, { flavor, image, region }) {
    return this.OvhApiCloudProjectImage
      .v6()
      .query({
        serviceName: projectId,
        flavorType: flavor.type,
        region,
      })
      .$promise
      .then(images => filter(images, {
        visibility: 'public',
        type: image ? image.type : 'linux',
      }));
  }

  rescue(projectId, { id: instanceId }, { id: imageId }) {
    return this.OvhApiCloudProjectInstance
      .v6()
      .rescueMode({
        serviceName: projectId,
        instanceId,
        imageId,
        rescue: true,
      })
      .$promise;
  }

  unrescue(projectId, { id: instanceId }) {
    return this.OvhApiCloudProjectInstance
      .v6()
      .rescueMode({
        serviceName: projectId,
        instanceId,
        rescue: false,
      })
      .$promise;
  }

  activeMonthlyBilling(projectId, { id: instanceId }) {
    return this.OvhApiCloudProjectInstance
      .v6()
      .activeMonthlyBilling({
        serviceName: projectId,
        instanceId,
      })
      .$promise;
  }

  getBackupPriceEstimation(projectId, instance) {
    return this.CucPriceHelper.getPrices(projectId)
      .then((catalog) => {
        const catalogPrice = get(
          catalog,
          `${INSTANCE_BACKUP_CONSUMPTION}.${instance.region}`,
          get(catalog, INSTANCE_BACKUP_CONSUMPTION, false),
        );

        if (catalogPrice) {
          const monthlyPriceValue = catalogPrice.priceInUcents * moment.duration(1, 'months').asHours() / 100000000;
          const totalPriceValue = monthlyPriceValue * instance.flavor.disk;

          return {
            price: catalogPrice.price,
            priceInUcents: catalogPrice.priceInUcents,
            monthlyPrice: {
              ...catalogPrice.price,
              value: monthlyPriceValue,
              text: catalogPrice.price.text.replace(/\d+(?:[.,]\d+)?/, round(monthlyPriceValue.toString(), 2)),
            },
            totalPrice: {
              ...catalogPrice.price,
              value: totalPriceValue,
              text: catalogPrice.price.text.replace(/\d+(?:[.,]\d+)?/, round(totalPriceValue.toString(), 2)),
            },
          };
        }
        return Promise.reject();
      });
  }

  createBackup(projectId, { id: instanceId }, { name: snapshotName }) {
    return this.OvhApiCloudProjectInstance
      .v6()
      .backup({
        serviceName: projectId,
        instanceId,
      }, {
        snapshotName,
      })
      .$promise;
  }

  resume(projectId, { id: instanceId }) {
    return this.OvhApiCloudProjectInstance
      .v6()
      .resume({
        serviceName: projectId,
        instanceId,
      })
      .$promise;
  }
}
