import get from 'lodash/get';
import has from 'lodash/has';
import includes from 'lodash/includes';
import filter from 'lodash/filter';
import find from 'lodash/find';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import some from 'lodash/some';

import Instance from '../../../components/project/instance/instance.class';
import InstanceQuota from '../../../components/project/instance/quota/quota.class';
import BlockStorage from '../storages/blocks/block.class';
import Datacenter from '../../../components/project/regions-list/datacenter.class';

import {
  BANDWIDTH_CONSUMPTION,
  BANDWIDTH_LIMIT,
  BANDWIDTH_OUT_INVOICE,
} from './instances.constants';

export default class PciProjectInstanceService {
  /* @ngInject */
  constructor(
    $q,
    CucPriceHelper,
    CucRegionService,
    OvhApiCloudProject,
    OvhApiCloudProjectFlavor,
    OvhApiCloudProjectImage,
    OvhApiCloudProjectInstance,
    OvhApiCloudProjectNetwork,
    OvhApiCloudProjectQuota,
    OvhApiCloudProjectVolume,
    OvhApiIp,
    OvhApiOrderCatalogPublic,
    PciProjectRegions,
  ) {
    this.$q = $q;
    this.CucPriceHelper = CucPriceHelper;
    this.CucRegionService = CucRegionService;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.OvhApiCloudProjectFlavor = OvhApiCloudProjectFlavor;
    this.OvhApiCloudProjectImage = OvhApiCloudProjectImage;
    this.OvhApiCloudProjectInstance = OvhApiCloudProjectInstance;
    this.OvhApiCloudProjectNetwork = OvhApiCloudProjectNetwork;
    this.OvhApiCloudProjectQuota = OvhApiCloudProjectQuota;
    this.OvhApiCloudProjectVolume = OvhApiCloudProjectVolume;
    this.OvhApiIp = OvhApiIp;
    this.OvhApiOrderCatalogPublic = OvhApiOrderCatalogPublic;
    this.PciProjectRegions = PciProjectRegions;
  }

  getAll(projectId) {
    return this.OvhApiCloudProjectInstance.v6()
      .query({
        serviceName: projectId,
      })
      .$promise.then((instances) =>
        map(instances, (instance) => new Instance(instance)),
      );
  }

  getAllInstanceDetails(projectId) {
    return this.getAll(projectId).then((instances) =>
      this.$q.all(
        map(instances, (instance) =>
          this.getInstanceDetails(projectId, instance),
        ),
      ),
    );
  }

  getInstanceFlavor(projectId, instance) {
    return this.OvhApiCloudProjectFlavor.v6().get({
      serviceName: projectId,
      flavorId: instance.flavorId,
    }).$promise;
  }

  getInstanceDetails(projectId, instance) {
    return this.$q
      .all({
        image: this.OvhApiCloudProjectImage.v6()
          .get({
            serviceName: projectId,
            imageId: instance.imageId,
          })
          .$promise.catch(() => null),
        flavor: this.OvhApiCloudProjectFlavor.v6()
          .get({
            serviceName: projectId,
            flavorId: instance.flavorId,
          })
          .$promise.then((flavor) => ({
            ...flavor,
            capabilities: this.constructor.transformCapabilities(
              get(flavor, 'capabilities', []),
            ),
          }))
          .catch(() => null),
        volumes: this.OvhApiCloudProjectVolume.v6()
          .query({
            serviceName: projectId,
          })
          .$promise.catch(() => []),
      })
      .then(
        ({ image, flavor, volumes }) =>
          new Instance({
            ...instance,
            image,
            flavor,
            volumes: filter(volumes, (volume) =>
              includes(volume.attachedTo, instance.id),
            ),
          }),
      );
  }

  get(projectId, instanceId) {
    return this.OvhApiCloudProjectInstance.v6()
      .get({
        serviceName: projectId,
        instanceId,
      })
      .$promise.then((instance) =>
        this.$q.all({
          instance,
          volumes: this.OvhApiCloudProjectVolume.v6()
            .query({
              serviceName: projectId,
            })
            .$promise.catch(() => []),
          privateNetworks: this.getPrivateNetworks(projectId),
          ipReverse: this.getReverseIp(instance),
        }),
      )
      .then(
        ({ instance, ipReverse, volumes, privateNetworks }) =>
          new Instance({
            ...instance,
            flavor: {
              ...instance.flavor,
              capabilities: this.constructor.transformCapabilities(
                get(instance.flavor, 'capabilities', []),
              ),
            },
            volumes: filter(volumes, (volume) =>
              includes(volume.attachedTo, instance.id),
            ),
            privateNetworks: filter(privateNetworks, (privateNetwork) =>
              includes(
                map(
                  filter(instance.ipAddresses, { type: 'private' }),
                  'networkId',
                ),
                privateNetwork.id,
              ),
            ),
            ipReverse,
          }),
      );
  }

  static transformCapabilities(capabilities) {
    return reduce(
      capabilities,
      (flavorCapabilities, currentCapability) => ({
        ...flavorCapabilities,
        [currentCapability.name]: currentCapability.enabled,
      }),
      {},
    );
  }

  delete(projectId, { id: instanceId }) {
    return this.OvhApiCloudProjectInstance.v6().delete({
      serviceName: projectId,
      instanceId,
    }).$promise;
  }

  reinstall(projectId, { id: instanceId, image, imageId }) {
    return this.OvhApiCloudProjectInstance.v6().reinstall(
      {
        serviceName: projectId,
        instanceId,
      },
      {
        imageId: imageId || image.id,
      },
    ).$promise;
  }

  reboot(projectId, { id: instanceId }, type) {
    return this.OvhApiCloudProjectInstance.v6().reboot(
      {
        serviceName: projectId,
        instanceId,
      },
      {
        type,
      },
    ).$promise;
  }

  getCompatibleRescueImages(projectId, { flavor, image, region }) {
    return this.OvhApiCloudProjectImage.v6()
      .query({
        serviceName: projectId,
        flavorType: flavor.type,
        region,
      })
      .$promise.then((images) =>
        filter(images, {
          visibility: 'public',
          type: image ? image.type : 'linux',
        }),
      );
  }

  rescue(projectId, { id: instanceId }, { id: imageId }) {
    return this.OvhApiCloudProjectInstance.v6().rescueMode({
      serviceName: projectId,
      instanceId,
      imageId,
      rescue: true,
    }).$promise;
  }

  unrescue(projectId, { id: instanceId }) {
    return this.OvhApiCloudProjectInstance.v6().rescueMode({
      serviceName: projectId,
      instanceId,
      rescue: false,
    }).$promise;
  }

  activeMonthlyBilling(projectId, { id: instanceId }) {
    return this.OvhApiCloudProjectInstance.v6().activeMonthlyBilling({
      serviceName: projectId,
      instanceId,
    }).$promise;
  }

  getSnapshotMonthlyPrice(projectId, instance) {
    return this.CucPriceHelper.getPrices(projectId).then((catalog) => {
      return get(
        catalog,
        `snapshot.monthly.postpaid.${instance.region}`,
        get(
          catalog,
          'snapshot.monthly.postpaid',
          get(catalog, 'snapshot.monthly', false),
        ),
      );
    });
  }

  createBackup(projectId, { id: instanceId }, { name: snapshotName }) {
    return this.OvhApiCloudProjectInstance.v6().backup(
      {
        serviceName: projectId,
        instanceId,
      },
      {
        snapshotName,
      },
    ).$promise;
  }

  resume(projectId, { id: instanceId }) {
    return this.OvhApiCloudProjectInstance.v6().resume({
      serviceName: projectId,
      instanceId,
    }).$promise;
  }

  getPrivateNetworks(projectId) {
    return this.OvhApiCloudProjectNetwork.Private()
      .v6()
      .query({
        serviceName: projectId,
      })
      .$promise.then((networks) =>
        filter(networks, {
          type: 'private',
        }),
      );
  }

  getPublicNetwork(projectId) {
    return this.OvhApiCloudProjectNetwork.Public()
      .v6()
      .query({
        serviceName: projectId,
      })
      .$promise.then(([publicNetwork]) => publicNetwork);
  }

  getCompatiblesPrivateNetworks(projectId, instance) {
    return this.getAvailablesPrivateNetworks(
      projectId,
      instance.region,
    ).then((networks) =>
      filter(
        networks,
        (network) => !includes(map(instance.privateNetworks, 'id'), network.id),
      ),
    );
  }

  getAvailablesPrivateNetworks(projectId, region) {
    return this.getPrivateNetworks(projectId).then((networks) =>
      filter(networks, (network) =>
        find(network.regions, { region, status: 'ACTIVE' }),
      ),
    );
  }

  getCompatiblesVolumes(projectId, { region }) {
    return this.OvhApiCloudProjectVolume.v6()
      .query({
        serviceName: projectId,
        region,
      })
      .$promise.then((volumes) =>
        map(volumes, (volume) => new BlockStorage(volume)),
      )
      .then((storages) =>
        filter(storages, (storage) => storage.isAttachable()),
      );
  }

  attachVolume(projectId, { id: volumeId }, { id: instanceId }) {
    return this.OvhApiCloudProjectVolume.v6().attach(
      {
        serviceName: projectId,
        volumeId,
      },
      {
        instanceId,
      },
    ).$promise;
  }

  getVNCInfos(projectId, { id: instanceId }) {
    return this.OvhApiCloudProjectInstance.v6().vnc({
      serviceName: projectId,
      instanceId,
    }).$promise;
  }

  getInstancePrice(projectId, instance) {
    return this.CucPriceHelper.getPrices(projectId)
      .then((prices) => {
        const price = prices[instance.planCode];
        // Set 3 digits for hourly price
        if (!instance.isMonthlyBillingActivated()) {
          price.price.text = price.price.text.replace(
            /\d+(?:[.,]\d+)?/,
            `${price.price.value.toFixed(3)}`,
          );
        }

        return price;
      })
      .catch(() => null);
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

  getInstanceQuota(projectId, region) {
    return this.getProjectQuota(projectId, region).then(
      (quota) => new InstanceQuota(quota.instance),
    );
  }

  getAvailablesRegions(projectId) {
    return this.$q
      .all({
        availableRegions: this.OvhApiCloudProject.Region()
          .AvailableRegions()
          .v6()
          .query({
            serviceName: projectId,
          }).$promise,
        regions: this.PciProjectRegions.getRegions(projectId),
      })
      .then(({ availableRegions, regions }) => {
        const supportedRegions = filter(regions, (region) =>
          some(get(region, 'services', []), { name: 'instance', status: 'UP' }),
        );
        return this.PciProjectRegions.groupByContinentAndDatacenterLocation(
          map(
            [...supportedRegions, ...availableRegions],
            (region) =>
              new Datacenter({
                ...region,
                ...this.CucRegionService.getRegion(region.name),
                available: has(region, 'status'),
              }),
          ),
        );
      });
  }

  save(
    projectId,
    {
      autobackup,
      flavorId,
      imageId,
      monthlyBilling,
      name,
      networks,
      region,
      sshKeyId,
      userData,
    },
    number = 1,
  ) {
    if (number > 1) {
      return this.OvhApiCloudProjectInstance.v6().bulk(
        {
          serviceName: projectId,
        },
        {
          autobackup,
          flavorId,
          imageId,
          monthlyBilling,
          name,
          networks,
          region,
          sshKeyId,
          userData,
          number,
        },
      ).$promise;
    }
    return this.OvhApiCloudProjectInstance.v6().save(
      {
        serviceName: projectId,
      },
      {
        autobackup,
        flavorId,
        imageId,
        monthlyBilling,
        name,
        networks,
        region,
        sshKeyId,
        userData,
      },
    ).$promise;
  }

  attachPrivateNetworks(projectId, { id: instanceId }, privateNetworks) {
    const promises = reduce(
      privateNetworks,
      (results, privateNetwork) => [
        ...results,
        this.OvhApiCloudProjectInstance.Interface()
          .v6()
          .save(
            {
              serviceName: projectId,
              instanceId,
            },
            {
              networkId: privateNetwork.id,
            },
          ).$promise,
      ],
      [],
    );
    return this.$q.all(promises);
  }

  update(projectId, { id: instanceId, name: instanceName }) {
    return this.OvhApiCloudProjectInstance.v6().put(
      {
        serviceName: projectId,
        instanceId,
      },
      {
        instanceName,
      },
    ).$promise;
  }

  resize(projectId, { id: instanceId, flavorId }) {
    return this.OvhApiCloudProjectInstance.v6().resize(
      {
        serviceName: projectId,
        instanceId,
      },
      {
        flavorId,
      },
    ).$promise;
  }

  getApplicationAccess(projectId, { id: instanceId }) {
    return this.OvhApiCloudProjectInstance.v6().applicationAccess({
      serviceName: projectId,
      instanceId,
    }).$promise;
  }

  getReverseIp({ ipAddresses }) {
    const ip = get(find(ipAddresses, { type: 'public', version: 4 }), 'ip');
    if (ip) {
      return this.OvhApiIp.Reverse()
        .v6()
        .query({ ip })
        .$promise.then(([ipReverse]) =>
          ipReverse
            ? this.OvhApiIp.Reverse()
                .v6()
                .get({ ip, ipReverse }).$promise
            : null,
        )
        .catch((error) =>
          error.status === 404 ? null : Promise.reject(error),
        );
    }
    return null;
  }

  getExtraBandwidthCost(project, user) {
    return this.OvhApiOrderCatalogPublic.v6()
      .get({
        productName: 'cloud',
        ovhSubsidiary: user.ovhSubsidiary,
      })
      .$promise.then((catalog) => {
        const projectPlan = find(catalog.plans, { planCode: project.planCode });
        const bandwidthOut = filter(
          map(
            find(projectPlan.addonFamilies, { name: BANDWIDTH_CONSUMPTION })
              .addons,
            (planCode) => find(catalog.addons, { planCode }),
          ),
          { invoiceName: BANDWIDTH_OUT_INVOICE },
        );

        return bandwidthOut.reduce(
          (prices, addon) => ({
            ...prices,
            [addon.planCode]: find(
              addon.pricings,
              (pricing) => get(pricing, 'quantity.min') === BANDWIDTH_LIMIT,
            ),
          }),
          {},
        );
      });
  }
}
