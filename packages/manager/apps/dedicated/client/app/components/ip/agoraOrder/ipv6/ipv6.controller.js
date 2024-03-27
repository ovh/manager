import find from 'lodash/find';

import { ALERT_ID } from '../ip-ip-agoraOrder.constant';

export default class AgoraIpV6OrderController {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $translate,
    $window,
    Alerter,
    IpAgoraOrder,
    IpAgoraV6Order,
    ovhManagerRegionService,
    User,
    coreConfig,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$translate = $translate;
    this.$window = $window;
    this.Alerter = Alerter;
    this.IpAgoraOrder = IpAgoraOrder;
    this.IpAgoraV6Order = IpAgoraV6Order;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.User = User;
    this.ALERT_ID = ALERT_ID;
    this.region = coreConfig.getRegion();
    this.ovhSubsidiary = coreConfig.getUser().ovhSubsidiary;
    this.loading = {};
  }

  $onInit() {
    this.model = {
      params: {},
      selectedService: null,
    };
    this.user = this.$state.params.user;
    this.catalogName = this.$state.params.catalogName;
  }

  loadServices() {
    this.loading.services = true;
    return this.$q
      .all({
        user: this.User.getUser(),
        services: this.IpAgoraV6Order.getVrackService(),
        ipv6Catalog: this.IpAgoraV6Order.getIpv6Catalog(this.ovhSubsidiary),
      })
      .then((results) => {
        this.user = results.user;
        this.services = results.services;
        this.ipv6Catalog = results.ipv6Catalog;
        if (this.$state.params.service) {
          this.model.selectedService = find(this.services, {
            serviceName: this.$state.params.service.serviceName,
          });
        }
      })
      .catch((err) => {
        this.Alerter.error(
          this.$translate.instant('ip_order_loading_error', this.ALERT_ID),
        );
        return this.$state.go('^').then(() => this.$q.reject(err));
      })
      .finally(() => {
        this.loading.services = false;
      });
  }

  loadRegions() {
    this.catalogByLocation = this.ipv6Catalog.map((plan) => {
      const {
        details: {
          product: { configurations },
        },
      } = plan;
      const regionConfig = configurations.find(
        (config) => config.name === 'ip_region',
      );
      const regionId = regionConfig.values[0] || '';
      const countryCode = this.ovhManagerRegionService.getMacroRegionLowercase(
        regionId,
      );
      return {
        regionId,
        planCode: plan.planCode,
        location: this.$translate.instant(`ip_agora_ipv6_location_${regionId}`),
        icon: `oui-flag oui-flag_${countryCode}`,
      };
    });
  }
}
