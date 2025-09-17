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
  DEFAULT_IP,
  DISTANT_BACKUP_FEATURE,
  FLAVORS_WITHOUT_ADDITIONAL_IPS,
  FLAVORS_WITHOUT_AUTOMATED_BACKUP,
  FLAVORS_WITHOUT_SOFT_REBOOT,
  FLAVORS_WITHOUT_SUSPEND,
  FLAVORS_WITHOUT_VNC,
} from './instances.constants';
import { ONE_AZ_REGION, THREE_AZ_REGION } from '../project.constants';

/* eslint class-methods-use-this: ["error", { "exceptMethods": ["getBaseApiRoute"] }] */
export default class PciProjectInstanceService {
  /* @ngInject */
  constructor(
    $http,
    $q,
    Poller,
    coreConfig,
    CucPriceHelper,
    CucCurrencyService,
    ovhManagerRegionService,
    OvhApiCloudProject,
    OvhApiCloudProjectFlavor,
    OvhApiCloudProjectImage,
    OvhApiCloudProjectInstance,
    OvhApiCloudProjectNetwork,
    OvhApiCloudProjectQuota,
    OvhApiCloudProjectVolume,
    OvhApiCloudProjectRegion,
    OvhApiIp,
    OvhApiOrderCatalogPublic,
    PciProjectRegions,
    PciProject,
    ovhFeatureFlipping,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.Poller = Poller;
    this.coreConfig = coreConfig;
    this.CucPriceHelper = CucPriceHelper;
    this.CucCurrencyService = CucCurrencyService;
    this.ovhManagerRegionService = ovhManagerRegionService;
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
    this.PciProject = PciProject;
    this.FLAVORS_WITHOUT_SOFT_REBOOT = FLAVORS_WITHOUT_SOFT_REBOOT;
    this.FLAVORS_WITHOUT_SUSPEND = FLAVORS_WITHOUT_SUSPEND;
    this.FLAVORS_WITHOUT_VNC = FLAVORS_WITHOUT_VNC;
    this.FLAVORS_WITHOUT_ADDITIONAL_IPS = FLAVORS_WITHOUT_ADDITIONAL_IPS;
    this.FLAVORS_WITHOUT_AUTOMATED_BACKUP = FLAVORS_WITHOUT_AUTOMATED_BACKUP;
    this.ovhFeatureFlipping = ovhFeatureFlipping;

    this.licensePriceFormatter = new Intl.NumberFormat(
      this.coreConfig.getUserLocale().replace('_', '-'),
      {
        style: 'currency',
        currency: this.coreConfig.getUser().currency.code,
        maximumFractionDigits: 5,
      },
    );
  }

  getBaseApiRoute(projectId) {
    return `/cloud/project/${projectId}`;
  }

  getAll(projectId, customerRegions) {
    return this.$http
      .get(`/cloud/project/${projectId}/instance`)
      .then(({ data }) => {
        const localZones = this.PciProject.getLocalZones(customerRegions);
        return data.map((instance) => {
          const isLocalZone = this.PciProject.checkIsLocalZone(
            localZones,
            instance.region,
          );
          return new Instance({ ...instance, isLocalZone });
        });
      });
  }

  getAllInstanceDetails(projectId) {
    return this.getAll(projectId, []).then((instances) =>
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

  get(projectId, instanceId, customerRegions) {
    let isLocalZone;
    const localZones = this.PciProject.getLocalZones(customerRegions);
    return this.OvhApiCloudProjectInstance.v6()
      .get({
        serviceName: projectId,
        instanceId,
      })
      .$promise.then((instance) => {
        isLocalZone = this.PciProject.checkIsLocalZone(
          localZones,
          instance.region,
        );
        return this.$q.all({
          instance,
          catalog: this.getCatalog(
            '/order/catalog/public/cloud',
            this.coreConfig.getUser(),
          ),
          volumes: this.OvhApiCloudProjectVolume.v6()
            .query({
              serviceName: projectId,
            })
            .$promise.catch(() => []),
          privateNetworks: isLocalZone
            ? this.getAllAvailablePrivateNetworks(projectId)
            : this.getPrivateNetworks(projectId),
          ipReverse: this.getReverseIp(instance),
        });
      })
      .then(({ instance, catalog, ipReverse, volumes, privateNetworks }) => {
        return new Instance({
          ...instance,
          flavor: {
            ...instance.flavor,
            capabilities: this.constructor.transformCapabilities(
              get(instance.flavor, 'capabilities', []),
            ),
            technicalBlob: get(
              catalog.addons.find(
                ({ planCode }) => planCode === instance.flavor.planCodes.hourly,
              ),
              'blobs.technical',
            ),
          },
          volumes: volumes.filter((volume) =>
            volume.attachedTo?.includes(instance.id),
          ),
          privateNetworks: privateNetworks.filter((privateNetwork) =>
            includes(
              map(
                filter(instance.ipAddresses, { type: 'private' }),
                'networkId',
              ),
              privateNetwork.id,
            ),
          ),
          ipReverse,
          isLocalZone,
        });
      });
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

  reinstallFromRegion(
    projectId,
    instanceRegion,
    instanceId,
    { imageId, region },
  ) {
    return this.$http.post(
      `/cloud/project/${projectId}/region/${instanceRegion}/instance/${instanceId}/reinstall`,
      { imageId, imageRegionName: region },
    );
  }

  start(projectId, instance) {
    return this.$http.post(
      `${this.getBaseApiRoute(projectId, instance)}/instance/${
        instance.id
      }/start`,
    );
  }

  stop(projectId, instance) {
    return this.$http.post(
      `${this.getBaseApiRoute(projectId, instance)}/instance/${
        instance.id
      }/stop`,
    );
  }

  shelve(projectId, instance) {
    return this.$http.post(
      `${this.getBaseApiRoute(projectId, instance)}/instance/${
        instance.id
      }/shelve`,
    );
  }

  unshelve(projectId, instance) {
    return this.$http.post(
      `${this.getBaseApiRoute(projectId, instance)}/instance/${
        instance.id
      }/unshelve`,
    );
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

  getSnapshotPricesByRegion(projectId, catalogEndpoint) {
    return this.$q
      .all([
        this.CucPriceHelper.getPrices(projectId, catalogEndpoint, true),
        this.getProductAvailability(projectId, undefined, 'snapshot'),
      ])
      .then(([catalog, { plans }]) => {
        return plans
          .filter(({ code }) => code.startsWith('snapshot.consumption'))
          .reduce((acc, plan) => {
            const catalogPlan = catalog[plan.code];
            plan.regions.forEach((r) => {
              if (!acc[r.name]) acc[r.name] = [catalogPlan];
              else acc[r.name].push(catalogPlan);
            });
            return acc;
          }, {});
      });
  }

  getSnapshotAvailability(projectId, catalogEndpoint) {
    return this.$q
      .all([
        this.getSnapshotPricesByRegion(projectId, catalogEndpoint),
        this.PciProjectRegions.getAvailableRegions(projectId),
      ])
      .then(([snapshotPricesByRegion, availableRegions]) =>
        Object.fromEntries(
          Object.entries(snapshotPricesByRegion).map(([regionName, plans]) => {
            return [
              regionName,
              {
                plans,
                workflow:
                  availableRegions
                    .find((r) => r.name === regionName)
                    ?.services.some((s) => s.name === 'workflow') || false,
              },
            ];
          }),
        ),
      );
  }

  createBackup(
    projectId,
    { id: instanceId },
    { name: snapshotName, distantRegion, distantSnapshotName },
  ) {
    return this.OvhApiCloudProjectInstance.v6().backup(
      {
        serviceName: projectId,
        instanceId,
      },
      {
        snapshotName,
        distantRegionName: distantRegion,
        distantSnapshotName,
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
    return this.$http
      .get(`/cloud/project/${projectId}/network/private`)
      .then(({ data }) => data);
  }

  getLocalPrivateNetworks(projectId, regionName) {
    return this.$http
      .get(`/cloud/project/${projectId}/region/${regionName}/network`)
      .then(({ data }) =>
        data.filter((network) => network.visibility === 'private'),
      );
  }

  getSubnets(projectId, networkId) {
    return this.$http
      .get(`/cloud/project/${projectId}/network/private/${networkId}/subnet`)
      .then(({ data }) => data);
  }

  getLocalPrivateNetworkSubnets(projectId, region, networkId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/region/${region}/network/${networkId}/subnet`,
      )
      .then(({ data }) => data[0])
      .catch(() => {});
  }

  getPublicNetwork(projectId) {
    return this.$http
      .get(`/cloud/project/${projectId}/network/public`)
      .then(({ data }) => data);
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

  getCompatiblesVolumes(
    projectId,
    { region, availabilityZone: instanceAvailabilityZone },
  ) {
    return this.OvhApiCloudProjectVolume.v6()
      .query({
        serviceName: projectId,
        region,
      })
      .$promise.then((volumes) =>
        map(volumes, (volume) => new BlockStorage(volume)),
      )
      .then((storages) =>
        filter(
          storages,
          (storage) =>
            storage.isAttachable() &&
            (!instanceAvailabilityZone ||
              storage.availabilityZone === 'any' ||
              storage.availabilityZone === instanceAvailabilityZone),
        ),
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

  getInstancePrice(projectId, instance, catalogEndpoint) {
    return this.getCatalog(catalogEndpoint, this.coreConfig.getUser())
      .then((catalog) => {
        const instanceAddon = catalog.addons.find(
          (a) => a.planCode === instance.planCode,
        );
        if (instanceAddon) {
          const price = this.CucPriceHelper.transformPrice(
            instanceAddon.pricings.find(
              (p) =>
                p.capacities.includes('renew') ||
                p.capacities.includes('consumption'),
            ),
            catalog.locale.currencyCode,
          );
          // Set 3 digits for hourly price
          if (!instance.isMonthlyBillingActivated()) {
            price.price.text = price.price.text.replace(
              /\d+(?:[.,]\d+)?/,
              `${price.price.value.toFixed(3)}`,
            );
          }

          if (instance.licensePlanCode) {
            const licensePricing = catalog.addons
              .find((a) => a.planCode === instance.licensePlanCode)
              ?.pricings.find((p) => p.capacities.includes('consumption'));
            if (licensePricing)
              price.licensePrice = this.formatLicensePrice(
                this.CucCurrencyService.convertUcentsToCurrency(
                  licensePricing.price,
                ) * instanceAddon.blobs.technical.cpu.cores,
              );
          }

          return price;
        }
        return null;
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

  getCompatiblesLocalPrivateNetworks(projectId, instance, customerRegions) {
    return this.getAllAvailablePrivateNetworks(projectId, instance.region).then(
      (networks) => {
        const localZones = this.PciProject.getLocalZones(customerRegions);
        return networks.filter(
          (network) =>
            !instance.privateNetworks
              .map(({ id }) => id)
              .includes(network.id) &&
            localZones.some(
              (region) =>
                region.name === network.region &&
                region.name === instance.region,
            ),
        );
      },
    );
  }

  getAllAvailablePrivateNetworks(serviceName) {
    return this.$http
      .get(`/cloud/project/${serviceName}/aggregated/network`)
      .then(({ data }) => {
        const privateNetworks = [];
        data.resources.forEach((network) => {
          if (network.visibility === 'private') {
            privateNetworks.push(network);
          }
        });
        return privateNetworks;
      });
  }

  getInstanceQuota(projectId, region) {
    return this.getProjectQuota(projectId, region).then(
      (quota) => new InstanceQuota(quota.instance),
    );
  }

  getAvailablesRegions(projectId, customerRegions) {
    return this.$q
      .all({
        availableRegions: this.OvhApiCloudProject.Region()
          .AvailableRegions()
          .v6()
          .query({
            serviceName: projectId,
          }).$promise,
        regions: this.PciProjectRegions.getRegions(projectId, customerRegions),
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
                ...this.ovhManagerRegionService.getRegion(region.name),
                available: has(region, 'status'),
              }),
          ),
        );
      });
  }

  getDistantBackupAvailableRegions(projectId, instanceRegionName) {
    return Promise.all([
      this.getProductAvailability(projectId, undefined, 'snapshot'),
      this.ovhFeatureFlipping.checkFeatureAvailability(DISTANT_BACKUP_FEATURE),
    ]).then(([productAvailability, feature]) => {
      if (!feature.isFeatureAvailable(DISTANT_BACKUP_FEATURE)) return [];

      const instancePlan = productAvailability.plans.find(
        (p) =>
          p.code.startsWith('snapshot.consumption') &&
          p.regions.some((r) => r.name === instanceRegionName),
      );

      const instanceRegion = instancePlan?.regions.find(
        (r) => r.name === instanceRegionName,
      );

      if (
        !instanceRegion ||
        (instanceRegion.type !== THREE_AZ_REGION &&
          instanceRegion.type !== ONE_AZ_REGION)
      )
        return [];

      const regions = productAvailability.plans
        .filter((p) => p.code.startsWith('snapshot.consumption'))
        .flatMap((p) => p.regions);

      return regions
        .filter(
          (r) =>
            r.name !== instanceRegionName &&
            (r.type === THREE_AZ_REGION || r.type === ONE_AZ_REGION),
        )
        .map((r) => ({
          ...r,
          ...this.ovhManagerRegionService.getRegion(r.name),
        }));
    });
  }

  getProductAvailability(
    projectId,
    ovhSubsidiary = this.coreConfig.getUser().ovhSubsidiary,
    addonFamily,
  ) {
    return this.$http
      .get(`/cloud/project/${projectId}/capabilities/productAvailability`, {
        params: {
          ovhSubsidiary,
          addonFamily,
        },
      })
      .then(({ data }) => data);
  }

  getRegionsTypesAvailability(projectId) {
    return this.getProductAvailability(
      projectId,
      this.coreConfig.getUser().ovhSubsidiary,
      'instance',
    ).then(({ plans }) => {
      return plans
        .flatMap((plan) => plan.regions)
        .reduce((acc, region) => {
          acc[region.type] = true;
          return acc;
        }, {});
    });
  }

  save(
    serviceName,
    region,
    {
      autobackup,
      flavorId,
      imageId,
      monthlyBilling,
      name,
      network,
      sshKey,
      userData,
      availabilityZone,
    },
    number = 1,
  ) {
    return this.$http
      .post(`/cloud/project/${serviceName}/region/${region}/instance`, {
        bulk: number,
        autobackup,
        flavor: {
          id: flavorId,
        },
        bootFrom: {
          imageId,
        },
        billingPeriod: monthlyBilling ? 'monthly' : 'hourly',
        name,
        network,
        sshKey: sshKey ? { name: sshKey.name } : null,
        userData,
        availabilityZone,
      })
      .then(({ data }) => {
        return data;
      });
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
          // If IP isn't known or user has no permission to query it: skip error and do not display the reverse.
          // we don't want to prevent pci instance edition because IP cannot be displayed
          error.status === 404 || error.status === 403
            ? null
            : Promise.reject(error),
        );
    }
    return null;
  }

  getCommercialCatalog({ productCode, nature, ovhSubsidiary }) {
    return this.$http({
      url: '/engine/api/v2/commercialCatalog/offers',
      serviceType: 'apiv2',
      params: {
        merchants: ovhSubsidiary,
        type: 'ATOMIC',
        nature,
        productCode,
      },
    }).then(({ data: catalog }) => catalog);
  }

  getCatalog(endpoint, user) {
    return this.CucPriceHelper.getCatalog(endpoint, user, true);
  }

  getExtraBandwidthCost(endpoint, project, user) {
    return this.getCatalog(endpoint, user).then((catalog) => {
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

  getSubnetGateways(serviceName, region, subnetId) {
    return this.$http
      .get(`/cloud/project/${serviceName}/region/${region}/gateway`, {
        params: {
          subnetId,
        },
      })
      .then(({ data }) => data);
  }

  getGateways(serviceName, region) {
    return this.$http
      .get(`/cloud/project/${serviceName}/region/${region}/gateway`)
      .then(({ data }) => data);
  }

  getFloatingIps(serviceName, region) {
    return this.$http
      .get(`/cloud/project/${serviceName}/region/${region}/floatingip`)
      .then(({ data }) => data);
  }

  createAndAttachFloatingIp(serviceName, region, instanceId, floatingIpModel) {
    const createAndAssociateFloatingIp = 'create-associate-floatingIp';
    return this.$http
      .post(
        `/cloud/project/${serviceName}/region/${region}/instance/${instanceId}/floatingIp`,
        {
          ...floatingIpModel,
        },
      )
      .then(({ data: { id } }) => {
        const url = `/cloud/project/${serviceName}/operation/${id}`;
        const status = 'completed';
        return this.checkOperationStatus(
          url,
          createAndAssociateFloatingIp,
          status,
        );
      })
      .then((data) => {
        this.Poller.kill({ namespace: createAndAssociateFloatingIp });
        return data;
      });
  }

  associateFloatingIp(serviceName, region, instanceId, floatingIpModel) {
    const associateFloatingIP = 'associate-floatingIp';
    return this.$http
      .post(
        `/cloud/project/${serviceName}/region/${region}/instance/${instanceId}/associateFloatingIp`,
        {
          ...floatingIpModel,
        },
      )
      .then(({ data: { id } }) => {
        const url = `/cloud/project/${serviceName}/operation/${id}`;
        const status = 'completed';
        return this.checkOperationStatus(url, associateFloatingIP, status);
      })
      .then((data) => {
        this.Poller.kill({ namespace: associateFloatingIP });
        return data;
      });
  }

  enableDhcp(serviceName, networkId, dhcpModel) {
    return this.$http
      .post(
        `/cloud/project/${serviceName}/network/private/${networkId}/subnet`,
        dhcpModel,
      )
      .then(({ data }) => data);
  }

  createGateway(serviceName, region, networkId, subnetId, gatewayModel) {
    const createGatewayNamespace = 'gateway-creation';
    return this.$http
      .post(
        `/cloud/project/${serviceName}/region/${region}/network/${networkId}/subnet/${subnetId}/gateway`,
        gatewayModel,
      )
      .then(({ data: { id } }) => {
        const url = `/cloud/project/${serviceName}/operation/${id}`;
        const status = 'completed';
        return this.checkOperationStatus(url, createGatewayNamespace, status);
      })
      .then((data) => {
        this.Poller.kill({ namespace: createGatewayNamespace });
        return data;
      });
  }

  createNetworkWithGateway(serviceName, regionName, gateway) {
    const addNetworkGatewayNamespace = 'network-gateway-creation';
    return this.$http
      .post(
        `/cloud/project/${serviceName}/region/${regionName}/network`,
        gateway,
      )
      .then(({ data: { id } }) => {
        const url = `/cloud/project/${serviceName}/operation/${id}`;
        const status = 'completed';
        return this.checkOperationStatus(
          url,
          addNetworkGatewayNamespace,
          status,
        );
      })
      .then((data) => {
        this.Poller.kill({ namespace: addNetworkGatewayNamespace });
        return data;
      });
  }

  checkOperationStatus(url, namespace, status) {
    return this.Poller.poll(url, null, {
      method: 'get',
      successRule: {
        status,
      },
      namespace,
    });
  }

  automatedBackupIsAvailable(flavorType) {
    return !this.FLAVORS_WITHOUT_AUTOMATED_BACKUP.find((value) =>
      value.test(flavorType),
    );
  }

  softRebootIsAvailable(flavorType) {
    return !this.FLAVORS_WITHOUT_SOFT_REBOOT.find((value) =>
      value.test(flavorType),
    );
  }

  suspendIsAvailable(flavorType) {
    return !this.FLAVORS_WITHOUT_SUSPEND.find((value) =>
      value.test(flavorType),
    );
  }

  vncConsoleIsAvailable(flavorType) {
    return !this.FLAVORS_WITHOUT_VNC.find((value) => value.test(flavorType));
  }

  additionalIpsIsAvailable(flavorType) {
    return !this.FLAVORS_WITHOUT_ADDITIONAL_IPS.find((value) =>
      value.test(flavorType),
    );
  }

  createPrivateNetwork(
    projectId,
    region,
    privateNetworkName,
    subnet,
    vlanId = null,
    gateway,
  ) {
    return this.$http
      .post(`/cloud/project/${projectId}/region/${region}/network`, {
        name: privateNetworkName,
        subnet,
        ...(gateway && { gateway }),
        ...(typeof vlanId === 'number' && { vlanId }),
      })
      .then(({ data: { id } }) =>
        this.checkPrivateNetworkCreationStatus(projectId, id),
      )
      .then(({ resourceId }) => {
        this.Poller.kill({ namespace: 'private-network-creation' });
        return resourceId;
      });
  }

  checkPrivateNetworkCreationStatus(projectId, operationId) {
    return this.Poller.poll(
      `/cloud/project/${projectId}/operation/${operationId}`,
      {},
      {
        method: 'get',
        successRule: {
          status: 'completed',
        },
        namespace: 'private-network-creation',
      },
    );
  }

  associateGatewayToNetwork(projectId, region, gatewayId, subnetId) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/region/${region}/gateway/${gatewayId}/interface`,
        {
          subnetId,
        },
      )
      .then(({ data }) => data);
  }

  static generateNetworkAddress(vlanId) {
    return DEFAULT_IP.replace('{vlanId}', vlanId % 255);
  }

  getPrivateNetworksByRegion(serviceName, customerRegions = []) {
    return this.$http
      .get(`/cloud/project/${serviceName}/aggregated/network`)
      .then(({ data }) => {
        const privateNetworks = {};
        const localZones = this.PciProject.getLocalZones(customerRegions);
        data.resources.forEach((network) => {
          if (
            network.visibility === 'private' &&
            !this.PciProject.checkIsLocalZone(localZones, network.region)
          ) {
            if (!privateNetworks[network.vlanId]) {
              const { id, region, ...rest } = network;
              privateNetworks[network.vlanId] = {
                ...rest,
                region,
                subnets: [{ region, networkId: id }],
              };
            } else {
              const { id, region } = network;
              privateNetworks[network.vlanId].subnets.push({
                region,
                networkId: id,
              });
            }
          }
        });
        return Object.values(privateNetworks).sort(
          (a, b) => a.vlanId - b.vlanId,
        );
      });
  }

  getLicensePrice(catalog, flavor) {
    if (flavor.planCodes.license) {
      const price = catalog.addons
        .find(({ planCode }) => planCode === flavor.planCodes.license)
        ?.pricings.find((p) => p.type === 'consumption').price;

      if (price) {
        return this.CucCurrencyService.convertUcentsToCurrency(price);
      }
    }
    return null;
  }

  formatLicensePrice(price) {
    return this.licensePriceFormatter.format(price);
  }
}
