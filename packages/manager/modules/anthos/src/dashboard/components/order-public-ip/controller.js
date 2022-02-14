import { PRICE_DURATION } from '../../../anthos.constants';
import { MAX_QUANTITY, PRODUCT_ID, TRACKING_CHUNK } from './constants';

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
    if (!this.availableOptions.publicIps) {
      this.goBack(
        this.$translate.instant('anthos_dashboard_order_public_ip_init_error'),
        'error',
      );
    }

    this.User.getUrlOf('express_order')
      .then((expressOrderUrl) => {
        this.expressOrderUrl = expressOrderUrl;
      })
      .catch(() =>
        this.goBack(
          this.$translate.instant(
            'anthos_dashboard_order_public_ip_init_error',
          ),
          'error',
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }

  order() {
    const addon = this.availableOptions.publicIps;
    this.trackClick(`${TRACKING_CHUNK}::confirm_${this.quantity}`);

    const products = [
      {
        productId: PRODUCT_ID,
        serviceName: this.serviceName,
        planCode: addon.planCode,
        duration: PRICE_DURATION,
        pricingMode: addon.pricingMode,
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
