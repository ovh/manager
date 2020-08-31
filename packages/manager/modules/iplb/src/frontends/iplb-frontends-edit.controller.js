import find from 'lodash/find';
import has from 'lodash/has';
import includes from 'lodash/includes';
import map from 'lodash/map';
import set from 'lodash/set';
import trim from 'lodash/trim';

export default class IpLoadBalancerFrontendsEditCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateParams,
    $translate,
    CucCloudMessage,
    CucControllerHelper,
    IpLoadBalancerConstant,
    IpLoadBalancerFailoverIpService,
    IpLoadBalancerFrontendsService,
    IpLoadBalancerZoneService,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.CucControllerHelper = CucControllerHelper;
    this.IpLoadBalancerConstant = IpLoadBalancerConstant;
    this.IpLoadBalancerFailoverIpService = IpLoadBalancerFailoverIpService;
    this.IpLoadBalancerFrontendsService = IpLoadBalancerFrontendsService;
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
    this.farms = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.IpLoadBalancerFrontendsService.getFarmsChoices(
          this.getFarmType(),
          this.$stateParams.serviceName,
          this.frontend.zone,
        ),
    });
    this.certificates = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.IpLoadBalancerFrontendsService.getCertificatesChoices(
          this.$stateParams.serviceName,
        ),
    });
    this.failoverIps = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.IpLoadBalancerFailoverIpService.getFailoverIpsSelectData(
          this.$stateParams.serviceName,
        ),
    });
    this.apiFrontend = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.IpLoadBalancerFrontendsService.getAllFrontendsTypes(
          this.$stateParams.serviceName,
        )
          .then((frontends) => {
            const frontend = find(frontends, {
              id: parseInt(this.$stateParams.frontendId, 10),
            });
            return this.IpLoadBalancerFrontendsService.getFrontend(
              frontend.type,
              this.$stateParams.serviceName,
              this.$stateParams.frontendId,
            );
          })
          .then((frontend) => this.parseFrontend(frontend)),
    });
  }

  getFarmType() {
    switch (this.protocol) {
      case 'http':
      case 'https':
        return 'http';
      case 'tcp':
      case 'tls':
        return 'tcp';
      default:
        return this.protocol;
    }
  }

  getFarmName(farm) {
    const farmName = farm.displayName || farm.farmId;
    if (farm.farmId > 0) {
      const farmType = this.$translate.instant(
        `iplb_frontend_add_protocol_${farm.type}`,
      );
      return `${farmName} (${farmType})`;
    }
    return farmName;
  }

  static getCertificateName(certificate) {
    if (certificate.id <= 0) {
      return certificate.displayName;
    }
    return certificate.displayName
      ? `${certificate.displayName} (${certificate.id})`
      : certificate.id;
  }

  onProtocolChange() {
    this.farmType = this.getFarmType();
    switch (this.protocol) {
      case 'http':
        this.type = 'http';
        this.frontend.port = 80;
        this.frontend.ssl = false;
        break;
      case 'https':
        this.type = 'http';
        this.frontend.port = 443;
        this.frontend.ssl = true;
        this.frontend.hsts = false;
        break;
      case 'tcp':
        this.type = 'tcp';
        delete this.frontend.port;
        this.frontend.ssl = false;
        break;
      case 'udp':
        this.type = 'udp';
        delete this.frontend.port;
        this.frontend.ssl = false;
        break;
      case 'tls':
        this.type = 'tcp';
        delete this.frontend.port;
        this.frontend.ssl = true;
        break;
      default:
        break;
    }

    if (this.frontend.ssl) {
      this.certificates.load();
    }

    this.farms.load();
  }

  onZoneChange() {
    this.frontend.defaultFarmId = null;
    this.farms.load();
  }

  $onInit() {
    this.frontend = {
      dedicatedIpfo: [],
      defaultSslId: 0,
      defaultFarmId: 0,
      port: 80,
      ssl: false,
      hsts: false,
    };
    this.type = 'http';
    this.protocol = 'http';
    this.saving = false;
    this.protocols = this.IpLoadBalancerConstant.protocols;
    this.portLimit = this.IpLoadBalancerConstant.portLimit;

    this.zones.load();
    this.failoverIps.load();

    if (this.$stateParams.frontendId) {
      this.edition = true;
      this.apiFrontend
        .load()
        .then(() => (this.frontend.ssl ? this.certificates.load() : null))
        .then(() => {
          this.farms.load();
        });
    } else {
      this.farms.load();
    }
  }

  static validateSelection(value) {
    return value && value !== '0';
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

  /**
   * Parse frontend object from API and send it to form.
   * @return parsed frontend object
   */
  parseFrontend(frontend) {
    this.type = frontend.protocol;
    switch (frontend.protocol) {
      case 'http':
        this.protocol = frontend.ssl ? 'https' : 'http';
        break;
      case 'tcp':
        this.protocol = frontend.ssl ? 'tls' : 'tcp';
        break;
      case 'udp':
        this.protocol = 'udp';
        break;
      default:
        break;
    }

    if (has(frontend, 'allowedSource.length')) {
      set(frontend, 'allowedSource', frontend.allowedSource.join(', '));
    }

    this.frontend = angular.copy(frontend);
    return frontend;
  }

  /**
   * Clean frontend from form and send it to API.
   * @return clean frontend object
   */
  getCleanFrontend() {
    const request = angular.copy(this.frontend);
    if (this.type === 'udp') {
      delete request.ssl;
    }

    if (includes(['udp', 'tcp'], this.type)) {
      delete request.hsts;
    }

    if (!request.ssl || !request.defaultSslId) {
      delete request.defaultSslId;
    }
    if (!request.defaultFarmId && request.defaultFarmId === 0) {
      delete request.defaultFarmId;
    } else if (request.defaultFarmId === 0) {
      request.defaultFarmId = null;
    }
    if (this.frontend.allowedSource) {
      request.allowedSource = map(
        this.frontend.allowedSource.split(','),
        (source) => trim(source),
      );
    } else {
      request.allowedSource = [];
    }

    delete request.protocol;
    return request;
  }

  sendForm() {
    if (this.$stateParams.frontendId) {
      this.updateFrontend();
    } else {
      this.addFrontend();
    }
  }

  createFrontend() {
    if (this.form.$invalid) {
      return this.$q.reject();
    }
    this.saving = true;
    this.CucCloudMessage.flushChildMessage();
    return this.IpLoadBalancerFrontendsService.createFrontend(
      this.type,
      this.$stateParams.serviceName,
      this.getCleanFrontend(),
    )
      .then(() => this.$state.go('iplb.detail.frontends'))
      .finally(() => {
        this.saving = false;
      });
  }

  updateFrontend() {
    if (this.form.$invalid) {
      return this.$q.reject();
    }
    this.saving = true;
    this.CucCloudMessage.flushChildMessage();
    return this.IpLoadBalancerFrontendsService.updateFrontend(
      this.type,
      this.$stateParams.serviceName,
      this.frontend.frontendId,
      this.getCleanFrontend(),
    )
      .then(() => this.$state.go('iplb.detail.frontends'))
      .finally(() => {
        this.saving = false;
      });
  }
}
