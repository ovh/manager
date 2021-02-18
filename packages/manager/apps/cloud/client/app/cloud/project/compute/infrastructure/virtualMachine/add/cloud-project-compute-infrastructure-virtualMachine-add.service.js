import assign from 'lodash/assign';
import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import has from 'lodash/has';
import includes from 'lodash/includes';
import indexOf from 'lodash/indexOf';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import padStart from 'lodash/padStart';
import property from 'lodash/property';
import reduce from 'lodash/reduce';
import remove from 'lodash/remove';
import set from 'lodash/set';
import some from 'lodash/some';
import sortBy from 'lodash/sortBy';
import tap from 'lodash/tap';
import thru from 'lodash/thru';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';

class CloudProjectVirtualMachineAddService {
  constructor(
    $q,
    $translate,
    CloudFlavorService,
    CloudImageService,
    CucControllerModalHelper,
    OvhApiCloudProject,
    OvhApiCloudProjectInstance,
    OvhApiCloudProjectNetworkPrivateSubnet,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.CloudFlavorService = CloudFlavorService;
    this.CloudImageService = CloudImageService;
    this.CucControllerModalHelper = CucControllerModalHelper;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.OvhApiCloudProjectInstance = OvhApiCloudProjectInstance;
    this.OvhApiCloudProjectNetworkPrivateSubnet = OvhApiCloudProjectNetworkPrivateSubnet;
  }

  getAugmentedImages(images) {
    return map(
      uniqBy(images, 'id'),
      this.CloudImageService.constructor.augmentImage,
    );
  }

  filterFlavorsByType(flavors, type) {
    return filter(
      map(
        filter(flavors, {
          available: true,
          osType: type,
        }),
        (flavor) => this.CloudFlavorService.augmentFlavor(flavor),
      ),
      {
        diskType: 'ssd',
        flex: false,
      },
    );
  }

  static getFilteredFlavorsByRegion(flavors, regionCode) {
    const filteredFlavors = uniqBy(
      remove(flavors, { region: regionCode }),
      'name',
    );
    const usedFlavorNames = uniq(map(filteredFlavors, (flavor) => flavor.name));
    const notAvailableFlavors = filter(
      flavors,
      (flavor) => !includes(usedFlavorNames, flavor.name),
    );
    const outOfRegionFlavors = map(
      uniqBy(notAvailableFlavors, 'name'),
      (flavor) => {
        set(
          flavor,
          'regions',
          map(
            filter(notAvailableFlavors, (f) => f.name === flavor.name),
            'region',
          ),
        );
        set(flavor, 'disabled', 'NOT_AVAILABLE');
        // eslint-disable-next-line no-param-reassign
        delete flavor.region;
        // eslint-disable-next-line no-param-reassign
        delete flavor.price;
        return flavor;
      },
    );

    return filteredFlavors.concat(outOfRegionFlavors);
  }

  static getFilteredPrivateNetworksByRegion(
    privateNetworks,
    regionCode,
    subNets = [],
  ) {
    return map(
      sortBy(
        filter(privateNetworks, (network) => {
          if (!has(subNets, network.id)) {
            return false;
          }
          return some(network.regions, {
            region: regionCode,
          });
        }),
        'vlanId',
      ),
      (network) =>
        assign(network, {
          vlanId: padStart(network.vlanId, 4, '0'),
        }),
    );
  }

  getImageApps(images) {
    return uniqBy(
      forEach(this.CloudImageService.constructor.getApps(images), (app) => {
        set(
          app,
          'appName',
          get(app, 'name', '')
            .replace(/^[a-z0-9\s]+ - /gi, '')
            .replace(' - deprecated', ''),
        );
        // eslint-disable-next-line no-param-reassign
        delete app.region;
        // eslint-disable-next-line no-param-reassign
        delete app.id;
      }),
      'name',
    ).sort((image1, image2) =>
      // eslint-disable-next-line no-nested-ternary
      image1.appName < image2.appName
        ? -1
        : image1.appName > image2.appName
        ? 1
        : 0,
    );
  }

  static getMostRecentVm(vms) {
    return (
      filter(vms, { status: 'ACTIVE' }).sort(
        (vm1, vm2) => new Date(vm2.created) - new Date(vm1.created),
      )[0] || null
    );
  }

  getPrivateNetworksSubNets(serviceName, privateNetworks) {
    let networkIds = [];
    return thru(
      map(
        tap(map(privateNetworks, property('id')), (ids) => {
          networkIds = ids;
        }),
        (networkId) =>
          this.OvhApiCloudProjectNetworkPrivateSubnet.v6().query({
            serviceName,
            networkId,
          }).$promise,
      ),
      (promises) => {
        // .mapKeys on a more recent lodash.
        const collection = {};
        forEach(promises, (promise, key) => {
          collection[networkIds[key]] = promise;
        });
        return this.$q.all(collection);
      },
    )
      .then((subNets) => subNets)
      .catch(() => []);
  }

  getRegionsByImageType(regions, allImages, imageType) {
    if (this.CloudImageService.constructor.isSnapshot(imageType)) {
      return filter(
        regions,
        (region) => get(imageType, 'region', '') === region.microRegion.code,
      );
    }

    const filteredImages = filter(cloneDeep(allImages), {
      distribution: get(imageType, 'distribution'),
      nameGeneric: get(imageType, 'nameGeneric'),
      status: 'active',
    });
    const filteredRegions = uniq(map(filteredImages, (image) => image.region));
    return filter(
      regions,
      (region) => indexOf(filteredRegions, region.microRegion.code) > -1,
    );
  }

  static groupRegionsByDatacenter(regions) {
    const groupedByMacroRegions = groupBy(regions, 'macroRegion.code');
    const groupedRegions = map(groupedByMacroRegions, (microRegions) => {
      const region = cloneDeep(microRegions[0]);
      region.dataCenters = microRegions;
      delete region.microRegion;
      delete region.disabled;
      return region;
    });
    return groupedRegions;
  }

  groupFlavorsByCategory(flavors, flavorsTypes) {
    return sortBy(
      reduce(
        flavorsTypes,
        (previousValues, flavorType) => {
          const flavorsOfCurrentFlavorType = filter(flavors, {
            type: flavorType,
          });

          if (isEmpty(flavorsOfCurrentFlavorType)) {
            return previousValues;
          }

          const category = this.CloudFlavorService.getCategory(
            flavorType,
            true,
          );
          const categoryObject = find(previousValues, {
            category: category.id,
          });
          const matchingFlavors = filter(flavors, { type: flavorType }).value();

          if (!categoryObject) {
            return previousValues.concat({
              category: category.id,
              order: category.order,
              flavors: matchingFlavors,
            });
          }

          categoryObject.flavors = categoryObject.flavors
            .concat(matchingFlavors)
            .sort((a, b) =>
              a.name.localeCompare(b.name, undefined, {
                numeric: true,
                sensitivity: 'base',
              }),
            );

          return previousValues;
        },
        [],
      ),
      'order',
    );
  }

  hasVRack(serviceName) {
    return this.OvhApiCloudProject.v6()
      .vrack({ serviceName })
      .$promise.then(() => true)
      .catch((err) => {
        if (get(err, 'status') === 404) {
          return false;
        }
        return this.$q.reject(err);
      });
  }

  openSshKeyRegionModal(sshKey) {
    return this.CucControllerModalHelper.showConfirmationModal({
      titleText: this.$translate.instant(
        'cpcivm_add_step1_sshKey_regions_title',
      ),
      text: this.$translate.instant('cpcivm_add_step1_sshKey_regions_message', {
        sshKey,
      }),
    });
  }

  openQuotaModal(type, params = null) {
    this.CucControllerModalHelper.showWarningModal({
      title: this.$translate.instant(`cpcivm_add_step3_disabled_${type}`),
      message: this.$translate.instant(
        `cpcivm_add_step3_disabled_message_${type}`,
        params,
      ),
    });
  }

  createVirtualMachine(serviceName, data) {
    const postVm = {
      flavorId: get(data, 'flavor.id'),
      imageId: get(data, 'imageId.id'),
      name: get(data, 'name', 'No Name'),
      region: get(data, 'region.microRegion.code'),
      sshKeyId: get(data, 'sshKey.id', undefined),
      monthlyBilling: get(data, 'billingPeriod', '') === 'monthly',
      userData: get(data, 'userData', undefined),
      networks: get(data, 'networks', undefined),
    };

    if (data.number > 1) {
      postVm.number = data.number;
      return this.OvhApiCloudProjectInstance.v6().bulk({ serviceName }, postVm)
        .$promise;
    }

    return this.OvhApiCloudProjectInstance.v6().save({ serviceName }, postVm)
      .$promise;
  }

  static roundBandwidthValue(value) {
    return Math.floor(value / 50) * 50;
  }
}

angular
  .module('managerApp')
  .service(
    'CloudProjectVirtualMachineAddService',
    CloudProjectVirtualMachineAddService,
  );
