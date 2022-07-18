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
  FLAVORS_WITHOUT_AUTOMATED_BACKUP,
  FLAVORS_WITHOUT_SOFT_REBOOT,
  FLAVORS_WITHOUT_SUSPEND,
} from './instances.constants';

export default class PciProjectInstanceService {
  /* @ngInject */
  constructor(
    $http,
    $q,
    Poller,
    coreConfig,
    CucPriceHelper,
    ovhManagerRegionService,
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
    this.$http = $http;
    this.$q = $q;
    this.Poller = Poller;
    this.coreConfig = coreConfig;
    this.CucPriceHelper = CucPriceHelper;
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
    this.FLAVORS_WITHOUT_SOFT_REBOOT = FLAVORS_WITHOUT_SOFT_REBOOT;
    this.FLAVORS_WITHOUT_SUSPEND = FLAVORS_WITHOUT_SUSPEND;
  }

  getAll(projectId) {
    return this.$http
      .get(`/cloud/project/${projectId}/instance`)
      .then(({ data }) => data.map((instance) => new Instance(instance)));
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

  start(projectId, { id: instanceId }) {
    return this.$http.post(
      `/cloud/project/${projectId}/instance/${instanceId}/start`,
    );
  }

  stop(projectId, { id: instanceId }) {
    return this.$http.post(
      `/cloud/project/${projectId}/instance/${instanceId}/stop`,
    );
  }

  shelve(projectId, { id: instanceId }) {
    return this.$http.post(
      `/cloud/project/${projectId}/instance/${instanceId}/shelve`,
    );
  }

  unshelve(projectId, { id: instanceId }) {
    return this.$http.post(
      `/cloud/project/${projectId}/instance/${instanceId}/unshelve`,
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

  getSnapshotMonthlyPrice(projectId, instance, catalogEndpoint) {
    return this.CucPriceHelper.getPrices(projectId, catalogEndpoint).then(
      (catalog) => {
        return get(
          catalog,
          `snapshot.monthly.postpaid.${instance.region}`,
          get(
            catalog,
            'snapshot.monthly.postpaid',
            get(catalog, 'snapshot.monthly', false),
          ),
        );
      },
    );
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
    return this.$http
      .get(`/cloud/project/${projectId}/network/private`)
      .then(({ data }) => data);
  }

  getSubnets(projectId, networkId) {
    return this.$http
      .get(`/cloud/project/${projectId}/network/private/${networkId}/subnet`)
      .then(({ data }) => data);
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

  getInstancePrice(projectId, instance, catalogEndpoint) {
    return this.CucPriceHelper.getPrices(projectId, catalogEndpoint)
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
                ...this.ovhManagerRegionService.getRegion(region.name),
                available: has(region, 'status'),
              }),
          ),
        );
      });
  }

  save(
    serviceName,
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
    isPrivateMode,
  ) {
    const saveInstanceNamespace = 'instance-creation';
    const status = 'ACTIVE';
    if (number > 1) {
      return this.$http
        .post(`/cloud/project/${serviceName}/instance/bulk`, {
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
        })
        .then(({ data }) => {
          if (isPrivateMode) {
            const url = `/cloud/project/${serviceName}/instance/${data.id}`;
            return this.checkOperationStatus(
              url,
              saveInstanceNamespace,
              status,
            ).then((res) => {
              this.Poller.kill({ namespace: saveInstanceNamespace });
              return res;
            });
          }
          return data;
        });
    }
    return this.$http
      .post(`/cloud/project/${serviceName}/instance`, {
        autobackup,
        flavorId,
        imageId,
        monthlyBilling,
        name,
        networks,
        region,
        sshKeyId,
        userData,
      })
      .then(({ data }) => {
        if (isPrivateMode) {
          const url = `/cloud/project/${serviceName}/instance/${data.id}`;
          return this.checkOperationStatus(
            url,
            saveInstanceNamespace,
            status,
          ).then((res) => {
            this.Poller.kill({ namespace: saveInstanceNamespace });
            return res;
          });
        }
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
          error.status === 404 ? null : Promise.reject(error),
        );
    }
    return null;
  }

  getCatalog(endpoint, user) {
    return this.$http
      .get(endpoint, {
        params: {
          productName: 'cloud',
          ovhSubsidiary: user.ovhSubsidiary,
        },
      })
      .then(({ data: catalog }) => catalog);
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
    return (
      !this.coreConfig.isRegion('US') &&
      !FLAVORS_WITHOUT_AUTOMATED_BACKUP.find((value) => value.test(flavorType))
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
}
