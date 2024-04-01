import find from 'lodash/find';

import { ALERT_ID, DASHBOARD, FLAGS } from './ipv6.constant';

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
      selectedPlan: null,
      option: null,
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
      })
      .then((results) => {
        this.user = results.user;
        this.services = results.services;
        this.ipv6Catalog = this.getIpv6Catalog();
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
        return this.$state.go(DASHBOARD).then(() => this.$q.reject(err));
      })
      .finally(() => {
        this.loading.services = false;
      });
  }

  getIpv6Catalog() {
    return this.ipCatalog.filter(
      (plan) => plan.planCode.match(/^ip-v6.*/) != null,
    );
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
      const countryCode = this.constructor.getMacroRegion(regionId);

      return {
        regionId,
        planCode: plan.planCode,
        location: this.$translate.instant(`ip_agora_ipv6_location_${regionId}`),
        icon: `oui-flag oui-flag_${FLAGS[countryCode]}`,
      };
    });
  }

  static getMacroRegion(region) {
    const localZonePattern = /^lz/i;
    const devZonePattern = /^1-/i;

    let macro;
    const local = region
      .split('-')
      ?.slice(2)
      ?.join('-');

    if (devZonePattern.test(local)) {
      macro = [local];
    } else {
      const nbOfSlice = localZonePattern.test(local) ? 3 : 2;
      macro = /[\D]{2,3}/.exec(
        region
          .split('-')
          ?.slice(nbOfSlice)
          ?.join('-'),
      );
    }

    return (macro && macro[0]) || '';
  }

  redirectToPaymentPage() {
    const { planCode, regionId } = this.model.selectedPlan;
    const productToOrder = this.IpAgoraOrder.constructor.createProductToOrder({
      productId: 'ip',
      pricingMode: 'default',
      regionId,
      country: this.ovhSubsidiary,
      destination: this.selectedService,
      duration: 'P1M',
      planCode,
      quantity: 1,
    });

    return this.User.getUrlOf('express_order')
      .then((url) => {
        this.$window.open(
          `${url}review?products=${JSURL.stringify([productToOrder])}`,
          '_blank',
        );
      })
      .catch((err) => {
        this.Alerter.error(
          this.$translate.instant('ip_order_finish_error'),
          this.ALERT_ID,
        );
        return this.$state.go(DASHBOARD).then(() => this.$q.reject(err));
      })
      .finally(() => this.$state.go(DASHBOARD));
  }

  resumeOrder() {
    return this.$state.go(DASHBOARD);
  }
}
