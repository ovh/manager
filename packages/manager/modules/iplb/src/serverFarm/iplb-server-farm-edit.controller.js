import assign from 'lodash/assign';
import find from 'lodash/find';
import includes from 'lodash/includes';
import pick from 'lodash/pick';
import set from 'lodash/set';

import IplbServerFormProbTemplate from './probe/iplb-server-farm-probe.html';

export default class IpLoadBalancerServerFarmEditCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateParams,
    CucCloudMessage,
    CucControllerHelper,
    IpLoadBalancerConstant,
    IpLoadBalancerServerFarmService,
    IpLoadBalancerVrackService,
    IpLoadBalancerZoneService,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.CucCloudMessage = CucCloudMessage;
    this.CucControllerHelper = CucControllerHelper;
    this.IpLoadBalancerConstant = IpLoadBalancerConstant;
    this.IpLoadBalancerServerFarmService = IpLoadBalancerServerFarmService;
    this.IpLoadBalancerVrackService = IpLoadBalancerVrackService;
    this.IpLoadBalancerZoneService = IpLoadBalancerZoneService;

    this.initLoaders();
  }

  initLoaders() {
    this.zones = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.IpLoadBalancerZoneService.getZonesSelectData(
          this.$stateParams.serviceName,
        ),
    });

    this.privateNetworks = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.IpLoadBalancerVrackService.getPrivateNetworks(
          this.$stateParams.serviceName,
        ),
    });

    this.apiFarm = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.IpLoadBalancerServerFarmService.getAllFarmsTypes(
          this.$stateParams.serviceName,
        )
          .then((farms) => {
            const farm = find(farms, {
              id: parseInt(this.$stateParams.farmId, 10),
            });
            return this.IpLoadBalancerServerFarmService.getServerFarm(
              this.$stateParams.serviceName,
              this.$stateParams.farmId,
              farm.type,
            );
          })
          .then((farm) => this.parseFarm(farm)),
    });
  }

  $onInit() {
    this.farm = {
      balance: 'roundrobin',
      port: 80,
      probe: {
        type: '',
      },
    };
    this.saving = false;
    this.protocol = 'http';
    this.type = 'http';
    this.protocols = this.IpLoadBalancerConstant.protocols;
    this.balances = this.IpLoadBalancerConstant.balances;
    this.stickinesses = this.IpLoadBalancerConstant.stickinesses;
    this.probeTypes = this.IpLoadBalancerConstant.probeTypes;

    this.portLimit = this.IpLoadBalancerConstant.portLimit;

    this.zones.load();
    this.privateNetworks.load();
    this.updateStickinessList();

    if (this.$stateParams.farmId) {
      this.edition = true;
      this.apiFarm.load();
    }
  }

  isProtocolDisabled(protocol) {
    if (!this.edition) {
      return false;
    }

    if (this.type === 'http' && /http/.test(protocol)) {
      return false;
    }
    if (this.protocol === protocol) {
      return false;
    }

    return true;
  }

  static validateSelection(value) {
    return value && value !== '0';
  }

  onProtocolChange() {
    switch (this.protocol) {
      case 'http':
        this.type = 'http';
        this.farm.port = 80;
        break;
      case 'https':
        this.type = 'http';
        this.farm.port = 443;
        break;
      case 'tcp':
        this.type = 'tcp';
        delete this.farm.port;
        break;
      case 'udp':
        this.type = 'udp';
        delete this.farm.port;
        break;
      case 'tls':
        this.type = 'tcp';
        delete this.farm.port;
        break;
      default:
        break;
    }

    this.updateStickinessList();
  }

  updateStickinessList() {
    if (this.type === 'tcp') {
      this.availableStickinesses = this.stickinesses.filter(
        (stickiness) => stickiness !== 'cookie',
      );
    } else {
      this.availableStickinesses = this.stickinesses;
    }
  }

  /**
   * Parse farm object from API and send it to form.
   * @return parsed farm object
   */
  parseFarm(farm) {
    this.type = farm.type;
    this.protocol = farm.type;
    set(farm, 'port', parseInt(farm.port, 10));
    if (!farm.probe || (farm.probe && !farm.probe.type)) {
      set(farm, 'probe', { type: '' });
    }
    if (!farm.stickiness) {
      set(farm, 'stickiness', 'none');
    }
    this.updateStickinessList();
    this.farm = angular.copy(farm);
    return farm;
  }

  /**
   * Clean farm from form and send it to API.
   * @return clean farm object
   */
  getCleanFarm() {
    const request = angular.copy(this.farm);
    delete request.type;
    delete request.zoneText;
    if (request.stickiness === 'none') {
      request.stickiness = null;
    }

    request.probe = this.getCleanProbe();

    if (this.type === 'udp') {
      delete request.balance;
      delete request.stickiness;
      delete request.probe;
    }
    return request;
  }

  getCleanProbe() {
    const request = angular.copy(this.farm);
    const pickList = ['type', 'pattern', 'interval', 'negate'];
    switch (request.probe.type) {
      case 'http':
        pickList.push('url');
        pickList.push('port');
        pickList.push('method');
        pickList.push('match');
        pickList.push('forceSsl');
        break;
      case 'mysql':
      case 'pgsql':
      case 'smtp':
        pickList.push('port');
        break;
      case 'tcp':
        pickList.push('port');
        if (includes(['default', 'contains', 'matches'], request.probe.match)) {
          pickList.push('match');
        } else {
          request.probe.pattern = '';
          request.probe.negate = null;
        }
        break;
      case 'oco':
        break;
      default:
        request.probe = {};
    }

    return pick(request.probe, pickList);
  }

  editProbe() {
    this.CucControllerHelper.modal
      .showModal({
        modalConfig: {
          template: IplbServerFormProbTemplate,
          controller: 'IpLoadBalancerServerFarmProbeEditCtrl',
          controllerAs: 'IpLoadBalancerServerFarmProbeEditCtrl',
          resolve: {
            availableProbes: () =>
              this.IpLoadBalancerServerFarmService.getAvailableFarmProbes(
                this.$stateParams.serviceName,
              ),
            farm: () => this.farm,
            edition: () => this.edition,
          },
        },
      })
      .then((probe) => {
        assign(this.farm, { probe });
      });
  }

  create() {
    if (this.form.$invalid) {
      return this.$q.reject();
    }
    this.saving = true;
    this.CucCloudMessage.flushChildMessage();
    return this.IpLoadBalancerServerFarmService.create(
      this.type,
      this.$stateParams.serviceName,
      this.getCleanFarm(),
    )
      .then(() => {
        this.$state.go('iplb.detail.server-farm');
      })
      .finally(() => {
        this.saving = false;
      });
  }

  update() {
    if (this.form.$invalid) {
      return this.$q.reject();
    }
    this.saving = true;
    this.CucCloudMessage.flushChildMessage();
    return this.IpLoadBalancerServerFarmService.update(
      this.type,
      this.$stateParams.serviceName,
      this.farm.farmId,
      this.getCleanFarm(),
    )
      .then(() => {
        this.$state.go('iplb.detail.server-farm');
      })
      .finally(() => {
        this.saving = false;
      });
  }
}
