import {
  MAX_QUANTITY,
  PRODUCT_ID,
  PRICE_DURATION,
  TRACKING_CHUNK,
} from './constants';
import { extractPublicIpsAddonFromAnthosServiceOption } from './utils';

export default class {
  /* @ngInject */
  constructor($q, $translate, AnthosTenantsService, User) {
    this.$q = $q;
    this.$translate = $translate;
    this.AnthosTenantsService = AnthosTenantsService;
    this.User = User;

    this.addon = null;
    this.expressOrderUrl = '';
    this.quantity = 1;
    this.isLoading = true;
    this.MAX_QUANTITY = MAX_QUANTITY;
  }

  $onInit() {
    this.$q
      .all({
        anthosServiceOption: this.AnthosTenantsService.getAnthosServiceOption(
          this.serviceName,
        ),
        expressOrderUrl: this.User.getUrlOf('express_order'),
      })
      .then(({ anthosServiceOption, expressOrderUrl }) => {
        this.addon = extractPublicIpsAddonFromAnthosServiceOption(
          anthosServiceOption,
        );
        this.expressOrderUrl = expressOrderUrl;
        if (!this.addon) throw new Error('missingAddon');
      })
      .catch(() => {
        this.displayAlerterMessage(
          'error',
          this.$translate.instant(
            'anthos_dashboard_order_public_ip_init_error',
          ),
        );
        this.goBack();
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  order() {
    this.trackClick(`${TRACKING_CHUNK}::confirm_${this.quantity}`);

    const products = [
      {
        productId: PRODUCT_ID,
        serviceName: this.serviceName,
        planCode: this.addon.planCode,
        duration: PRICE_DURATION,
        pricingMode: this.addon.pricingMode,
        quantity: this.quantity,
        configuration: [],
      },
    ];

    window.open(
      `${this.expressOrderUrl}review?products=${JSURL.stringify(products)}`,
      '_blank',
    );

    this.goBack();
  }

  onGoBack() {
    this.trackClick(`${TRACKING_CHUNK}::cancel`);
    return this.goBack();
  }
}
