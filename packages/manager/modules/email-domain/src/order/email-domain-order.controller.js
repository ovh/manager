import find from 'lodash/find';
import get from 'lodash/get';
import includes from 'lodash/includes';

export default class MXPlanOrderCtrl {
  /* @ngInject */
  constructor(
    $q,
    $timeout,
    $translate,
    $window,
    Alerter,
    coreConfig,
    coreURLBuilder,
  ) {
    this.$q = $q;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$window = $window;
    this.Alerter = Alerter;
    this.coreConfig = coreConfig;
    this.coreURLBuilder = coreURLBuilder;
  }

  $onInit() {
    this.currentIndex = 0;

    this.model = {
      selectedDomain: find(this.domains, this.domain),
      product: this.products[0],
      autoPayWithPreferredPaymentMethod: null,
      contractsAccepted: false,
    };

    this.loading = {
      domain: false,
      checkout: false,
    };
  }

  getProductTaxAmount({ planCode }) {
    const { plans } = this.catalog;
    const pricings = get(find(plans, { planCode }), 'pricings');
    const price = find(pricings, ({ capacities }) =>
      includes(capacities, 'installation'),
    );
    return price.tax;
  }

  onDomainChange() {
    this.loading.domain = true;
    return this.deleteItem(this.item)
      .catch((error) =>
        this.Alerter.error(
          this.$translate.instant('mxPlan_order_checkout_error', {
            message: get(error, 'data.message'),
          }),
        ),
      )
      .finally(() => {
        this.loading.domain = false;
      });
  }

  loadValidation() {
    this.loading.checkout = true;
    return this.addConfiguration(
      this.item,
      this.model.product,
      this.model.selectedDomain,
    )
      .then(({ item }) => {
        this.item = item;
        return this.getCheckout();
      })
      .then((checkout) => {
        this.checkout = checkout;
      })
      .catch((error) => {
        this.Alerter.error(
          this.$translate.instant('mxPlan_order_checkout_error', {
            message: get(error, 'data.message'),
          }),
        );
      })
      .finally(() => {
        this.loading.checkout = false;
      });
  }

  validateCheckout() {
    this.loading.checkout = true;
    const autoPayWithPreferredPaymentMethod = !!this.model.defaultPaymentMethod;
    return this.order(autoPayWithPreferredPaymentMethod)
      .then((order) => {
        if (order.url && !autoPayWithPreferredPaymentMethod) {
          this.$window.open(order.url, '_blank');
          return this.Alerter.success(
            this.$translate.instant('mxPlan_order_generated_purchase_success', {
              orderId: order.orderId,
              orderUrl: order.url,
            }),
          );
        }

        this.orderTrackingLink = this.coreConfig.isRegion('EU')
          ? this.coreURLBuilder.buildURL(
              'dedicated',
              '#/billing/order/:orderId',
              {
                orderId: order.orderId,
              },
            )
          : null;

        return this.orderTrackingLink;
      })
      .catch((error) =>
        this.Alerter.error(
          this.$translate.instant('mxPlan_order_error', {
            message: get(error, 'message'),
          }),
        ),
      )
      .finally(() => {
        this.$timeout(() => {
          this.loading.checkout = false;
        });
      });
  }

  onPaymentError() {
    return this.Alerter.error(
      this.$translate.instant('mxPlan_order_error_payment'),
    );
  }
}
