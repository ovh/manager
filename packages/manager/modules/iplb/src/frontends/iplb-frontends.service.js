import filter from 'lodash/filter';
import set from 'lodash/set';

export default class IpLoadBalancerFrontendsService {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    IpLoadBalancerConfigurationService,
    IpLoadBalancerZoneService,
    OvhApiIpLoadBalancing,
    ovhManagerRegionService,
    CucServiceHelper,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.IpLoadBalancerConfigurationService = IpLoadBalancerConfigurationService;
    this.IpLoadBalancerZoneService = IpLoadBalancerZoneService;
    this.IpLoadBalancing = OvhApiIpLoadBalancing;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.CucServiceHelper = CucServiceHelper;

    this.Frontend = {
      all: this.IpLoadBalancing.Frontend().v6(),
      tcp: this.IpLoadBalancing.Frontend()
        .Tcp()
        .v6(),
      udp: this.IpLoadBalancing.Frontend()
        .Udp()
        .v6(),
      http: this.IpLoadBalancing.Frontend()
        .Http()
        .v6(),
    };

    this.Farm = {
      tcp: this.IpLoadBalancing.Farm()
        .Tcp()
        .v6(),
      udp: this.IpLoadBalancing.Farm()
        .Udp()
        .v6(),
      http: this.IpLoadBalancing.Farm()
        .Http()
        .v6(),
    };
  }

  getFrontends(serviceName) {
    return this.getFrontendIndex(serviceName)
      .then((frontends) =>
        frontends.map((frontend) => this.transformFrontend(frontend)),
      )
      .catch(this.CucServiceHelper.errorHandler('iplb_frontend_list_error'));
  }

  getFrontendIndex(serviceName) {
    return this.getAllFrontendsTypes(serviceName).then((frontends) => {
      const promises = frontends.map((frontend) =>
        this.getFrontend(frontend.type, serviceName, frontend.id),
      );
      return this.$q.all(promises);
    });
  }

  getFrontend(type, serviceName, frontendId) {
    return this.Frontend[type]
      .get({
        serviceName,
        frontendId,
      })
      .$promise.then((frontend) => {
        set(frontend, 'protocol', type);
        return frontend;
      });
  }

  getAllFrontendsTypes(serviceName) {
    return this.Frontend.all.query({ serviceName }).$promise;
  }

  transformFrontend(frontend) {
    if (frontend.zone === 'all') {
      set(frontend, 'region', {
        macroRegion: {
          code: null,
          text: this.$translate.instant('iplb_zone_all'),
        },
      });
    } else {
      set(
        frontend,
        'region',
        this.ovhManagerRegionService.getRegion(frontend.zone),
      );
    }

    // Needed to trigger row loading with datagrid.
    // eslint-disable-next-line no-param-reassign
    delete frontend.$promise;

    return frontend;
  }

  getFarm(type, serviceName, farmId) {
    return this.Farm[type].get({
      serviceName,
      farmId,
    }).$promise;
  }

  getFarms(type, serviceName) {
    return this.Farm[type]
      .query({ serviceName })
      .$promise.then((ids) =>
        this.$q.all(ids.map((id) => this.getFarm(type, serviceName, id))),
      )
      .then((farms) =>
        farms.map((farm) => this.constructor.transformFarm(farm, type)),
      );
  }

  static transformFarm(farm, type) {
    set(farm, 'type', type);
    return farm;
  }

  getFarmsChoices(type, serviceName, zone) {
    return this.getFarms(type, serviceName).then((farmsParam) => {
      let farms = farmsParam;
      if (zone) {
        farms = filter(farms, { zone });
      }
      farms.unshift({
        displayName: this.$translate.instant('iplb_frontend_add_farm_no_farm'),
        farmId: null,
      });
      farms.unshift({
        displayName: this.$translate.instant(
          'iplb_frontend_add_select_placeholder',
        ),
        farmId: 0,
      });
      return farms;
    });
  }

  getZones() {
    return this.IpLoadBalancerZoneService.getIPLBZones()
      .then((zones) =>
        zones.reduce((zonesMapParam, zoneName) => {
          const zonesMap = zonesMapParam;
          zonesMap[zoneName] = this.ovhManagerRegionService.getRegion(
            zoneName,
          ).microRegion.text;
          return zonesMap;
        }, {}),
      )
      .then((zones) => {
        set(
          zones,
          'all',
          this.$translate.instant('iplb_frontend_add_datacenter_all'),
        );
        return Object.keys(zones).map((zoneKey) => ({
          id: zoneKey,
          name: zones[zoneKey],
        }));
      });
  }

  getCertificatesChoices(serviceName) {
    return this.getCertificates(serviceName).then((certificates) => {
      certificates.unshift({
        displayName: this.$translate.instant(
          'iplb_frontend_add_default_certificate_no_certificate',
        ),
        id: 0,
      });
      return certificates;
    });
  }

  getCertificates(serviceName) {
    return this.IpLoadBalancing.Ssl()
      .v6()
      .query({ serviceName })
      .$promise.then((ids) =>
        this.$q.all(ids.map((id) => this.getCertificate(serviceName, id))),
      );
  }

  getCertificate(serviceName, sslId) {
    return this.IpLoadBalancing.Ssl()
      .v6()
      .get({
        serviceName,
        sslId,
      }).$promise;
  }

  createFrontend(type, serviceName, frontend) {
    return this.Frontend[type]
      .post({ serviceName }, frontend)
      .$promise.then(() =>
        this.CucServiceHelper.successHandler('iplb_frontend_add_success')(),
      )
      .then(() => this.Frontend.all.resetQueryCache())
      .then(() => this.IpLoadBalancerConfigurationService.showRefreshWarning())
      .catch(this.CucServiceHelper.errorHandler('iplb_frontend_add_error'));
  }

  updateFrontend(type, serviceName, frontendId, frontend) {
    return this.Frontend[type]
      .put(
        {
          serviceName,
          frontendId,
        },
        frontend,
      )
      .$promise.then(() =>
        this.CucServiceHelper.successHandler('iplb_frontend_update_success')(),
      )
      .then(() => this.Frontend.all.resetQueryCache())
      .then(() => this.IpLoadBalancerConfigurationService.showRefreshWarning())
      .catch(this.CucServiceHelper.errorHandler('iplb_frontend_update_error'));
  }

  deleteFrontend(type, serviceName, frontendId) {
    return this.Frontend[type]
      .delete({
        serviceName,
        frontendId,
      })
      .$promise.then(() =>
        this.CucServiceHelper.successHandler('iplb_frontend_delete_success')(),
      )
      .then(() => this.Frontend.all.resetQueryCache())
      .then(() => this.IpLoadBalancerConfigurationService.showRefreshWarning())
      .catch(this.CucServiceHelper.errorHandler('iplb_frontend_delete_error'));
  }

  toggleFrontend(type, serviceName, frontend) {
    return this.Frontend[type]
      .put(
        {
          serviceName,
          frontendId: frontend.frontendId,
        },
        {
          disabled: frontend.disabled,
        },
      )
      .$promise.then(() =>
        this.CucServiceHelper.successHandler('iplb_frontend_toggle_success')(),
      )
      .then(() => this.Frontend.all.resetQueryCache())
      .then(() => this.IpLoadBalancerConfigurationService.showRefreshWarning())
      .catch(this.CucServiceHelper.errorHandler('iplb_frontend_toggle_error'));
  }
}
