import {
  MAX_ADDONS,
  PRICE_DURATION,
} from './anthos-dashboard-host-order.constants';
import { extractHostAddonsFromAnthosCatalog } from './anthos-dashboard-host-order.utils';

export default class AnthosDashboardHostOrderController {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    $timeout,
    AnthosTenantsService,
    User,
    coreConfig,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.$timeout = $timeout;
    this.AnthosTenantsService = AnthosTenantsService;
    this.User = User;

    this.addons = [];
    this.currencySymbol = coreConfig.getUser().currency.symbol;
    this.expressOrderUrl = '';
    this.isLoading = false;
    this.canOrder = false;
  }

  $onInit() {
    this.isLoading = true;

    this.$q
      .all({
        anthosCatalog: this.AnthosTenantsService.getAnthosCatalog(),
        expressOrderUrl: this.User.getUrlOf('express_order'),
      })
      .then(({ anthosCatalog, expressOrderUrl }) => {
        this.addons = extractHostAddonsFromAnthosCatalog(anthosCatalog);
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
      const adsLeft = MAX_ADDONS - ads;

      this.addons.forEach((addon) => {
        // eslint-disable-next-line no-param-reassign
        addon.$max = addon.quantity + adsLeft;
      });

      this.canOrder = this.addons.some(({ quantity }) => quantity > 0);
    });
  }

  openExpressOrder() {
    const products = this.addons
      .filter(({ quantity }) => quantity > 0)
      .map(({ quantity, $raw: addon }) => ({
        productId: 'anthos',
        serviceName: this.serviceName,
        planCode: addon.planCode,
        duration: PRICE_DURATION,
        pricingMode: addon.pricings[0].mode,
        quantity,
        configuration: [],
      }));

    window.open(
      `${this.expressOrderUrl}review?products=${JSURL.stringify(products)}`,
    );
  }
}
