import { MAX_HOST_ADDON, PRICE_DURATION } from '../../../anthos.constants';
import {
  TRACKING_CHUNK,
  TRACKING_PREFIX,
} from './anthos-dashboard-host-order.constants';

export default class AnthosDashboardHostOrderController {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    $timeout,
    AnthosTenantsService,
    User,
    coreConfig,
    atInternet,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.$timeout = $timeout;
    this.AnthosTenantsService = AnthosTenantsService;
    this.User = User;
    this.atInternet = atInternet;

    this.addons = [];
    this.currencySymbol = coreConfig.getUser().currency.symbol;
    this.expressOrderUrl = '';
    this.isLoading = false;
    this.canOrder = false;
  }

  $onInit() {
    this.addons = angular.copy(this.availableOptions.hosts);
    this.isLoading = true;

    this.User.getUrlOf('express_order')
      .then((expressOrderUrl) => {
        this.expressOrderUrl = expressOrderUrl;
      })
      .catch(() => {
        this.displayAlerterMessage(
          'error',
          this.$translate.instant('anthos_dashboard_host_order_init_error'),
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  onAddonQuantityChanged() {
    // Wait for the next tick since the addon's quantity is not changed yet
    this.$timeout(() => {
      const ads = this.addons.reduce((sum, { quantity }) => sum + quantity, 0);
      const adsLeft = MAX_HOST_ADDON - ads;

      this.addons.forEach((addon) => {
        // eslint-disable-next-line no-param-reassign
        addon.$max = addon.quantity + adsLeft;
      });

      this.canOrder = this.addons.some(({ quantity }) => quantity > 0);
    });
  }

  openExpressOrder() {
    const selectedAddons = this.addons.filter(({ quantity }) => quantity > 0);
    const trackingSuffix = selectedAddons
      .map(({ $raw: { planCode }, quantity }) => `${planCode}-${quantity}`)
      .join('_');

    this.trackClick(`${TRACKING_CHUNK}::confirm`);
    this.atInternet.trackClick({
      name: `${TRACKING_PREFIX}::${trackingSuffix}`,
      type: 'action',
    });

    const products = selectedAddons.map(({ quantity, $raw: addon }) => ({
      productId: 'anthos',
      serviceName: this.serviceName,
      planCode: addon.planCode,
      duration: PRICE_DURATION,
      pricingMode: addon.pricings[0].pricingMode,
      quantity,
      configuration: [],
    }));

    window.open(
      `${this.expressOrderUrl}review?products=${JSURL.stringify(products)}`,
    );
  }
}
