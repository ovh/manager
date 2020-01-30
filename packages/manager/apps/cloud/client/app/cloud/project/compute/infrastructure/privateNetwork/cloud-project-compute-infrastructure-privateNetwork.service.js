import every from 'lodash/every';

class CloudProjectComputeInfrastructurePrivateNetworkService {
  constructor(
    $q,
    $timeout,
    $translate,
    CucCloudMessage,
    URLS,
    OvhApiMe,
    OvhApiCloudProjectRegion,
    OvhApiCloudProjectNetworkPrivate,
    OvhApiCloudProjectNetworkPrivateSubnet,
  ) {
    this.$q = $q;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.URLS = URLS;
    this.User = OvhApiMe;
    this.Region = OvhApiCloudProjectRegion;
    this.OvhApiCloudProjectNetworkPrivate = OvhApiCloudProjectNetworkPrivate;
    this.Subnet = OvhApiCloudProjectNetworkPrivateSubnet;

    this.loaders = {
      privateNetwork: {
        query: false,
        get: false,
      },
      region: {
        query: false,
      },
      url: false,
      save: false,
      delete: false,
    };

    this.urls = {
      api: null,
    };

    this.constraints = {
      name: {
        required: true,
        trim: true,
        maxlength: 256,
      },
      vlanId: {
        required: true,
        min: 2,
        max: 4000,
        debounce: 50,
      },
      subnet: {
        address: {
          required: true,
          trim: true,
        },
        mask: {
          required: true,
          min: 1,
          max: 32,
          trim: true,
        },
        start: {
          required: true,
          trim: true,
        },
        end: {
          required: true,
          trim: true,
        },
      },
      region: {
        required: false,
      },
    };

    this.states = {
      retries: 0,
    };
  }

  fetchPrivateNetworks(serviceName) {
    this.loaders.privateNetwork.query = true;
    this.OvhApiCloudProjectNetworkPrivate.v6().resetCache();

    return this.OvhApiCloudProjectNetworkPrivate.v6()
      .query({
        serviceName,
      })
      .$promise.catch(() =>
        this.CucCloudMessage.error(
          this.$translate.instant('cpcipnd_fetch_private_networks_error'),
        ),
      )
      .finally(() => {
        this.loaders.privateNetwork.query = false;
      });
  }

  arePrivateNetworksLoading() {
    return this.loaders.privateNetwork.query === true;
  }

  fetchPrivateNetwork(serviceName, id) {
    this.loaders.privateNetwork.get = true;
    this.OvhApiCloudProjectNetworkPrivate.v6().resetCache();

    return this.OvhApiCloudProjectNetworkPrivate.v6()
      .get({
        serviceName,
        networkId: id,
      })
      .$promise.catch(() =>
        this.CucCloudMessage.error(
          this.$translate.instant('cpcipnd_fetch_private_network_error'),
        ),
      )
      .finally(() => {
        this.loaders.privateNetwork.get = false;
      });
  }

  isPrivateNetworkLoading() {
    return this.loaders.privateNetwork.get === true;
  }

  fetchRegions(serviceName) {
    this.loaders.region.query = true;

    return this.Region.v6()
      .query({
        serviceName,
      })
      .$promise.catch(() =>
        this.CucCloudMessage.error(
          this.$translate.instant('cpcipnd_fetch_regions_error'),
        ),
      )
      .finally(() => {
        this.loaders.region.query = false;
      });
  }

  areRegionsLoading() {
    return this.loaders.region.query === true;
  }

  fetchUrls() {
    this.loaders.url = true;

    return this.User.v6()
      .get()
      .$promise.then((me) => {
        this.urls.api = this.URLS.guides.vlans[me.ovhSubsidiary].api;
      })
      .catch(() => {
        this.urls.api = this.URLS.guides.vlans.FR.api;
      })
      .finally(() => {
        this.loaders.url = false;
      });
  }

  areUrlsLoading() {
    return this.loaders.url === true;
  }

  getUrls() {
    return this.urls;
  }

  savePrivateNetwork(projectId, privateNetwork, onSuccess) {
    this.loaders.save = true;

    return this.OvhApiCloudProjectNetworkPrivate.v6()
      .save(
        {
          serviceName: projectId,
        },
        privateNetwork,
      )
      .$promise.then((network) => {
        const options = {
          serviceName: projectId,
          privateNetworkId: network.id,
          status: 'ACTIVE',
        };

        this.states.retries = 0;

        this.pollPrivateNetworkStatus(
          options,
          () => {
            this.loaders.save = false;
            onSuccess(network, options);
          },
          (error) => {
            this.loaders.save = false;
            this.CucCloudMessage.error(
              this.$translate.instant('cpcipnd_poll_error', {
                message: error.data.message || JSON.stringify(error),
              }),
            );
          },
        );
      })
      .catch((error) => {
        this.CucCloudMessage.error(
          this.$translate.instant('cpcipnd_save_error', {
            message: error.data.message || JSON.stringify(error),
          }),
        );
        this.loaders.save = false;
      });
  }

  pollPrivateNetworkStatus(options, onSuccess, onFailure) {
    this.$timeout(() => {
      if (this.isPrivateNetworkLoading()) {
        return;
      }

      this.OvhApiCloudProjectNetworkPrivate.v6().resetCache();

      this.fetchPrivateNetwork(options.serviceName, options.privateNetworkId)
        .then((network) => {
          if (this.constructor.areAllRegionsActive(network)) {
            onSuccess(network, options);
          } else {
            this.pollPrivateNetworkStatus(options, onSuccess, onFailure);
          }
        })
        .catch((error) => onFailure(error));
    }, options.delay || 2000);
  }

  saveSubnet(projectId, networkId, subnet) {
    this.loaders.save = true;

    return this.Subnet.v6()
      .save(
        {
          serviceName: projectId,
          networkId,
        },
        subnet,
      )
      .$promise.catch((error) => {
        this.CucCloudMessage.error(
          this.$translate.instant('cpcipnd_save_error', {
            message: error.data.message || JSON.stringify(error),
          }),
        );
      })
      .finally(() => {
        this.loaders.save = false;
      });
  }

  isSavePending() {
    return this.loaders.save === true;
  }

  getConstraints() {
    return this.constraints;
  }

  static areAllRegionsActive(network) {
    return (
      network.status === 'ACTIVE' &&
      network.regions &&
      every(network.regions, (region) => region.status === 'ACTIVE')
    );
  }

  deleteProjectNetworkPrivate(serviceName, networkId) {
    this.loaders.delete = true;
    return this.OvhApiCloudProjectNetworkPrivate.v6()
      .delete({
        serviceName,
        networkId,
      })
      .$promise.catch((error) => this.$q.reject(error))
      .finally(() => {
        this.loaders.delete = false;
      });
  }

  isDeletePending() {
    return this.loaders.delete === true;
  }
}

angular
  .module('managerApp')
  .service(
    'CloudProjectComputeInfrastructurePrivateNetworkService',
    CloudProjectComputeInfrastructurePrivateNetworkService,
  );
