import find from 'lodash/find';

import {
  ALERT_ID,
  DASHBOARD_STATE_NAME,
  ADDITIONAL_IP,
  IP_TYPE_TITLE,
} from '../ip-ip-agoraOrder.constant';
import {
  FLAGS,
  DEDICATED_IP_ORDER_TRACKING_PREFIX,
  ACTIONS_SUFFIX,
} from './ipv6.constant';

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
    atInternet,
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
    this.atInternet = atInternet;
    this.User = User;
    this.ALERT_ID = ALERT_ID;
    this.region = coreConfig.getRegion();
    this.ovhSubsidiary = coreConfig.getUser().ovhSubsidiary;
    this.loading = {};
    this.ADDITIONAL_IP = ADDITIONAL_IP;
    this.type = IP_TYPE_TITLE.IPv6;
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
    this.ipv6Catalog = this.getIpv6Catalog();
    this.ipv6RegionsWithPlan = this.getIpv6RegionsWithPlan();
    this.canOrderIpv6 = true;
    this.regionState = {};

    this.IpAgoraV6Order.fetchIpv6Services().then((data) => {
      if (data.length < this.getIpv6OrderableNumber()) {
        this.IpAgoraV6Order.fetchIpv6ServicesWithDetails().then((ips) => {
          ips.forEach((ip) => {
            ip.regions.forEach((region) => {
              this.regionState[region] = this.regionState[region]
                ? this.regionState[region] + 1
                : 1;
            });
          });
        });
      } else {
        this.canOrderIpv6 = false;
      }
    });
  }

  getIpv6OrderableNumber() {
    return (
      Array.from(
        new Set(this.ipv6RegionsWithPlan.map(({ regionId }) => regionId)),
      ).length * 3
    );
  }

  loadServices() {
    this.trackClick('ipv6-additonal-option');
    this.loading.services = true;
    return this.$q
      .all({
        user: this.User.getUser(),
        services: this.IpAgoraV6Order.getVrackService(),
      })
      .then((results) => {
        this.user = results.user;
        this.services = results.services;
        if (this.$state.params.service) {
          this.model.selectedService = find(this.services, {
            serviceName: this.$state.params.service.serviceName,
          });
        }
      })
      .catch(() => {
        this.Alerter.error(
          this.$translate.instant('ip_order_loading_error', this.ALERT_ID),
        );
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

  getIpv6RegionsWithPlan() {
    return this.ipv6Catalog
      .map((plan) => {
        const {
          details: {
            product: { configurations },
          },
        } = plan;
        const regionConfig = configurations.find(
          (config) => config.name === 'ip_region',
        );

        return regionConfig.values.map((regionId) => ({
          regionId,
          plan: plan.planCode,
        }));
      })
      .flat();
  }

  loadRegions() {
    this.trackClick('next-step-2');

    this.catalogByLocation = this.ipv6RegionsWithPlan.map(
      ({ regionId, plan }) => {
        const countryCode = this.constructor.getMacroRegion(regionId);
        const nbIpv6onRegion = this.regionState[regionId]
          ? this.regionState[regionId]
          : 0;
        return {
          regionId,
          planCode: plan,
          available: this.canOrderIpv6 && nbIpv6onRegion < 3,
          location: this.$translate.instant(
            `ip_agora_ipv6_location_${regionId}`,
          ),
          icon: `oui-flag oui-flag_${FLAGS[countryCode]}`,
        };
      },
    );
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
      duration: 'P1M',
      planCode,
      quantity: 1,
      destination: this.model.selectedService,
    });

    this.atInternet.trackClick({
      name: `order::confirm_ipv6_${this.model.selectedService}_${regionId}`,
      type: ACTIONS_SUFFIX,
    });

    return this.User.getUrlOf('express_order')
      .then((url) => {
        this.$window.open(
          `${url}review?products=${JSURL.stringify([productToOrder])}`,
          '_blank',
        );
        this.goToDashboard();
      })
      .catch(() => {
        this.Alerter.error(
          this.$translate.instant('ip_order_finish_error'),
          this.ALERT_ID,
        );
      });
  }

  getRegionTooltip(regionAvailable) {
    if (!regionAvailable) {
      return this.canOrderIpv6
        ? this.$translate.instant('ipv6-per-region_limit_reached_error')
        : this.$translate.instant('ipv6_limit_reached_error');
    }
    return undefined;
  }

  goToDashboard() {
    return this.$state.go(DASHBOARD_STATE_NAME);
  }

  goToVrackPage() {
    this.$state.go('vrack.index');
  }

  trackClick(hit) {
    this.atInternet.trackClick({
      name: hit
        ? `${DEDICATED_IP_ORDER_TRACKING_PREFIX}::${hit}`
        : DEDICATED_IP_ORDER_TRACKING_PREFIX,
      type: ACTIONS_SUFFIX,
    });
  }
}
